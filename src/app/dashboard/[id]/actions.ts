"use server";

import { createClient } from "@/lib/supabase/server";
import { PDFParse } from "pdf-parse";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface deleteFileProps {
  fileId: string;
  workspaceId: string;
}

export async function deleteFile({ fileId, workspaceId }: deleteFileProps) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", fileId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return { error: error.message };
  }
  revalidatePath(`/dashboard/${workspaceId}`, "layout");
  redirect(`/dashboard/${workspaceId}`);
}

export async function uploadFile(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("file") as File;
  const workspaceId = formData.get("workspaceId") as string;

  if (!file || !workspaceId) {
    return { error: "Missing file or workspace" };
  }

  const path = `${workspaceId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage.from("pdfs").upload(path, file);

  if (uploadError) {
    return { error: "Upload failed:  " + uploadError.message };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const parser = new PDFParse({ data: buffer });
  const data = await parser.getText();
  const fulltext = data.text;
  await parser.destroy();

  const { data: document, error: dbError } = await supabase
    .from("documents")
    .insert({ name: file.name, storage_url: path, workspace_id: workspaceId })
    .select()
    .single();

  if (dbError) {
    return { error: "DB save failed :  " + dbError.message };
  }

  const chunks = splitText(fulltext, 1000, 200);

  try {
    const { embeddings } = await embedMany({
      model: google.embedding("gemini-embedding-001"),
      values: chunks,
      providerOptions: {
        google: {
          outputDimensionality: 1536,
        },
      },
    });

    const sections = chunks.map((chunk, i) => ({
      document_id: document.id,
      content: chunk,
      embedding: JSON.stringify(embeddings[i]),
    }));

    const { error: sectionError } = await supabase.from("document_sections").insert(sections);

    if (sectionError) {
      return { error: "Vector save failed :  " + sectionError.message };
    }
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured during processing";
    return {
      error: `AI processing failed: ${message}`,
    };
  }

  revalidatePath(`/dashboard/${workspaceId}`);
  return { success: true };
}

function splitText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

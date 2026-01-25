"use server";

import { createClient } from "@/lib/supabase/server";
import { PDFParse } from "pdf-parse";
import { embedMany } from "ai";
import { google } from "@ai-sdk/google";
import { revalidatePath } from "next/cache";

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
      model: google.embedding("text-embedding-004"),
      values: chunks,
    });

    const sections = chunks.map((chunk, i) => ({
      document_id: document.id,
      content: chunk,
      embedding: embeddings[i] as any,
    }));

    const { error: sectionError } = await supabase.from("document_sections").insert(sections);

    if (sectionError) {
      return { error: "Vector save failed :  " + sectionError.message };
    }
  } catch (e) {
    return { error: "AI embedding failed. Check API key" };
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

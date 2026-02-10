import { ChatInterface } from "@/components/ChatInterface";
import { UploadButton } from "@/components/UploadButton";
import WorkspacePageFileCard from "@/components/WorkspacePageFileCard";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface WorkspacePageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !workspace) {
    redirect("/dashboard");
  }

  const { data: files } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-8 flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <UploadButton workspaceId={workspace.id} />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Documents</h2>

        {files?.length == 0 ? (
          <div className="rounded-lg border-2 border-dashed py-10 text-center text-gray-400">
            <p>No documents yet.</p>
            <p className="text-sm">Upload a PDF to start chatting.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {files?.map((file) => (
              <WorkspacePageFileCard key={file.id} file={file} fileId={file.id} />
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t pt-8">
        <h2 className="mb-4 text-lg font-semibold">Chat with your Workspace</h2>
        <ChatInterface workspaceId={id} />
      </div>
    </div>
  );
}

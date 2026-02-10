"use client";
import { File } from "@/types/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { deleteFile } from "@/app/dashboard/[id]/actions";
import { useParams } from "next/navigation";

interface WorkspacePageFileCardProps {
  file: File;
  fileId: string;
}

export default function WorkspacePageFileCard({ file, fileId }: WorkspacePageFileCardProps) {
  const { id: workspaceId } = useParams<{ id: string }>();
  return (
    <li className="flex items-center gap-2 rounded-md bg-gray-50 p-3">
      <span className="truncate">{file.name}</span>
      <span>
        <Button
          size="icon-sm"
          onClick={async () => {
            await deleteFile({ fileId, workspaceId });
          }}
        >
          <X></X>
        </Button>
      </span>
      <span className="ml-auto text-xs text-gray-400">
        {new Date(file.created_at).toLocaleDateString()}
      </span>
    </li>
  );
}

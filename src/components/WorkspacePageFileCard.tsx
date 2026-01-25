import { File } from "@/types/types";

interface WorkspacePageFileCardProps {
  file: File;
}

export default function WorkspacePageFileCard({ file }: WorkspacePageFileCardProps) {
  return (
    <li className="flex items-center justify-between rounded-md bg-gray-50 p-3">
      <span className="truncate">{file.name}</span>
      <span className="text-xs text-gray-400">
        {new Date(file.created_at).toLocaleDateString()}
      </span>
    </li>
  );
}

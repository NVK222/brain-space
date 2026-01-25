"use client";

import { uploadFile } from "@/app/dashboard/[id]/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2, UploadCloud } from "lucide-react";

interface UploadButtonProps {
  workspaceId: string;
}

export function UploadButton({ workspaceId }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.item(0);
    if (!file) {
      return;
    }

    if (file.type != "application/pdf") {
      toast.error("Only PDFs are allowed");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspaceId", workspaceId);

    const result = await uploadFile(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("File uploaded and indexed");
    }

    setIsUploading(false);
  }

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button disabled={isUploading} asChild className="cursor-pointer">
          <span>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Indexing..." : "Upload PDF"}
          </span>
        </Button>
      </label>
    </div>
  );
}

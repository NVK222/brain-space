"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { createWorkspace } from "@/app/dashboard/actions";
import { Input } from "./ui/input";

export default function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4">New Workspace</Plus>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await createWorkspace(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <Input name="name" placeholder="e.g., Mathematics Class, Work Docs" required />
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

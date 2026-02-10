"use client";

import { Workspace } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { deleteWorkspace } from "@/app/dashboard/actions";

interface DashboardWorkspaceCardProps {
  workspace: Workspace;
}

export default function DashboardWorkspaceCard({ workspace }: DashboardWorkspaceCardProps) {
  const workspaceId = workspace.id;
  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card className="cursor-pointer transition hover:bg-gray-50">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>{workspace.name}</CardTitle>
          <span>
            <Button
              size="icon-sm"
              onClick={async () => {
                await deleteWorkspace({ workspaceId });
              }}
            >
              <X></X>
            </Button>
          </span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Created {new Date(workspace.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

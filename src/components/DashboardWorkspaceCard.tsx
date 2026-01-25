import { Workspace } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";

interface DashboardWorkspaceCardProps {
  workspace: Workspace;
}

export default function DashboardWorkspaceCard({ workspace }: DashboardWorkspaceCardProps) {
  return (
    <Link href={`/dashboard/${workspace.id}`}>
      <Card className="cursor-pointer transition hover:bg-gray-50">
        <CardHeader>
          <CardTitle>{workspace.name}</CardTitle>
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

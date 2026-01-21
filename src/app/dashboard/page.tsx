import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import DashboardWorkspaceCard from "@/components/DashboardWorkspaceCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your workspaces</h1>
        <CreateWorkspaceDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces?.length && workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <DashboardWorkspaceCard key={workspace.id} workspace={workspace} />
          ))
        ) : (
          <p className="text-muted-foreground w-full">No workspaces</p>
        )}
      </div>
    </div>
  );
}

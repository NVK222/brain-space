import { Database } from "./supabase";

export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];

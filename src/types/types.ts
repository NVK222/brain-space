import { Database } from "./supabase";

export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type File = Database["public"]["Tables"]["documents"]["Row"];

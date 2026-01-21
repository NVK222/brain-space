"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const { error } = await supabase.from("workspaces").insert({ name, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

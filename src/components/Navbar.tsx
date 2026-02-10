import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "@/app/login/actions";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="bg-background flex h-16 items-center border-b">
      <div className="container mx-auto flex items-center justify-between px-8">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Brain<span className="text-primary">Space</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-muted-foreground hidden text-sm md:inline">{user.email}</span>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <form action={signOut}>
                <Button variant="destructive">Sign Out</Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

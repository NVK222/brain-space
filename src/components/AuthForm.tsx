"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login, signup } from "@/app/login/actions";
import { useState } from "react";
import { toast } from "sonner";

export function AuthPage() {
  const [doLogin, setDoLogin] = useState<boolean>(true);

  const handleLogin = async (formData: FormData) => {
    const { error } = await login(formData);
    if (error) {
      toast.error(error);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    const { error } = await signup(formData);
    if (!error) {
      toast.success("Signed Up successfully. Please Login");
    } else {
      toast.error(error);
    }
  };

  return doLogin ? (
    <div className="flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Button formAction={handleLogin} className="w-full">
                Sign in
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground cursor-pointer text-sm"
                onClick={() => {
                  setDoLogin(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="flex h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account using an email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Button formAction={handleSignUp} className="w-full">
                Sign Up
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground cursor-pointer text-sm"
                onClick={() => {
                  setDoLogin(true);
                }}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

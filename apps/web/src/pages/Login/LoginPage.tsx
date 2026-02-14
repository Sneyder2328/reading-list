import { Navigate } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const { isLoading, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailAuthLoading, setIsEmailAuthLoading] = useState(false);

  if (!isLoading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6 bg-zinc-950">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Welcome to Reading List</CardTitle>
          <CardDescription>
            Sign in to sync bookmarks across the extension and web app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => setMode("signin")}
                type="button"
                variant={mode === "signin" ? "default" : "secondary"}
              >
                Sign in
              </Button>
              <Button
                className="flex-1"
                onClick={() => setMode("signup")}
                type="button"
                variant={mode === "signup" ? "default" : "secondary"}
              >
                Sign up
              </Button>
            </div>

            <div className="space-y-2">
              <input
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                value={email}
              />
              <input
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                value={password}
              />

              <Button
                className="w-full"
                disabled={
                  isEmailAuthLoading ||
                  email.length === 0 ||
                  password.length < 6
                }
                onClick={async () => {
                  try {
                    setIsEmailAuthLoading(true);
                    if (mode === "signin") {
                      await signInWithEmail(email, password);
                      toast.success("Signed in successfully");
                    } else {
                      await signUpWithEmail(email, password);
                      toast.success("Account created");
                    }
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : mode === "signin"
                          ? "Failed to sign in"
                          : "Failed to create account",
                    );
                  } finally {
                    setIsEmailAuthLoading(false);
                  }
                }}
                type="button"
              >
                {isEmailAuthLoading
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                    ? "Continue"
                    : "Create account"}
              </Button>

              <p className="text-xs text-zinc-500">
                Passwords must be at least 6 characters.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-500">
            By continuing, you agree to use Firebase Authentication for account
            access.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

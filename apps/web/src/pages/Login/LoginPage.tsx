import { Link, Navigate } from "@tanstack/react-router";
import { BookOpen, Chrome, Loader2, LogIn } from "lucide-react";
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
  const { isLoading, signIn, user } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

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
            Sign in with Google to sync bookmarks across the extension and web
            app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full gap-2 relative overflow-hidden"
            disabled={isSigningIn}
            onClick={async () => {
              try {
                setIsSigningIn(true);
                await signIn();
                toast.success("Signed in successfully");
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Failed to sign in with Google",
                );
              } finally {
                setIsSigningIn(false);
              }
            }}
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Continue with Google
              </>
            )}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          </Button>
          <p className="text-xs text-zinc-500">
            By continuing, you agree to use Firebase Authentication for account
            access.
          </p>
          <Link
            className="text-xs text-blue-300 hover:underline"
            to="/dashboard"
          >
            Continue as-is (requires active auth session)
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}

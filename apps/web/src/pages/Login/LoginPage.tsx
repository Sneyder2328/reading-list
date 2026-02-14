import { Link, Navigate } from "@tanstack/react-router";
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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Reading List</CardTitle>
          <CardDescription>
            Sign in with Google to sync bookmarks across the extension and web
            app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
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
                <span className="mr-2 inline-block size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </>
            ) : (
              "Continue with Google"
            )}
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

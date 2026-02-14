import { Navigate } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-6">
        <p className="text-sm text-zinc-400">Checking your session...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

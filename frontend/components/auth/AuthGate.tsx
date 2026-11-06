"use client";

import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import Button from "../ui/Button";

// Renders children only once signed in, so nothing calls the API without a token
const AuthGate = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center p-8 font-sans">
        <p role="status">Loading…</p>
      </main>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 font-sans">
        <h1 className="text-2xl font-bold">My Kanban Board</h1>
        {auth.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Sign-in failed: {auth.error.message}
          </p>
        )}
        <Button onClick={() => auth.signinRedirect()}>Sign in</Button>
      </main>
    );
  }

  return <>{children}</>;
};

export default AuthGate;

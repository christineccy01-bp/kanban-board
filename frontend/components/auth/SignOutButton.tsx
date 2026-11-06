"use client";

import { useAuth } from "react-oidc-context";
import Button from "../ui/Button";
import { redirectTo } from "./redirect";

export const getLogoutUrl = () =>
  `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
  `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
  `&logout_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL!)}`;

const SignOutButton = () => {
  const auth = useAuth();
  const email = auth.user?.profile.email;

  // Clear the session in the app, then on Cognito's side, so the next
  // sign-in asks for credentials again
  const handleSignOut = async () => {
    await auth.removeUser();
    redirectTo(getLogoutUrl());
  };

  return (
    <div className="flex items-center gap-3">
      {email && (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {email}
        </span>
      )}
      <Button variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
};

export default SignOutButton;

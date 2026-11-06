"use client";

import { ReactNode } from "react";
import { AuthProvider as OidcProvider } from "react-oidc-context";

// Cognito Hosted UI login (authorization code flow with PKCE).
// The user is stored in sessionStorage, where todoApi reads the access token.
const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_APP_URL!,
  response_type: "code",
  scope: "openid email",
  // Remove ?code=...&state=... from the address bar after login
  onSigninCallback: () =>
    window.history.replaceState({}, document.title, window.location.pathname),
};

const AuthProvider = ({ children }: { children: ReactNode }) => (
  <OidcProvider {...oidcConfig}>{children}</OidcProvider>
);

export default AuthProvider;

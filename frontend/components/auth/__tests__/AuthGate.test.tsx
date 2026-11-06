import { fireEvent, render, screen } from "@testing-library/react";
import { useAuth } from "react-oidc-context";
import AuthGate from "@/components/auth/AuthGate";

jest.mock("react-oidc-context", () => ({ useAuth: jest.fn() }));

const signinRedirect = jest.fn();

const mockAuth = (state: {
  isLoading?: boolean;
  isAuthenticated?: boolean;
  error?: Error;
}) =>
  jest.mocked(useAuth).mockReturnValue({
    isLoading: false,
    isAuthenticated: false,
    error: undefined,
    signinRedirect,
    ...state,
  } as unknown as ReturnType<typeof useAuth>);

const renderGate = () =>
  render(
    <AuthGate>
      <p>Secret board</p>
    </AuthGate>,
  );

beforeEach(() => signinRedirect.mockReset());

describe("AuthGate", () => {
  it("shows a loading state while the session is being checked", () => {
    mockAuth({ isLoading: true });
    renderGate();

    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    expect(screen.queryByText("Secret board")).not.toBeInTheDocument();
  });

  it("asks a signed-out user to sign in and redirects to Cognito", () => {
    mockAuth({});
    renderGate();

    expect(screen.queryByText("Secret board")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(signinRedirect).toHaveBeenCalledTimes(1);
  });

  it("shows the sign-in error and lets the user try again", () => {
    mockAuth({ error: new Error("Token exchange failed") });
    renderGate();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Sign-in failed: Token exchange failed",
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders the board once signed in", () => {
    mockAuth({ isAuthenticated: true });
    renderGate();

    expect(screen.getByText("Secret board")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign in" }),
    ).not.toBeInTheDocument();
  });
});

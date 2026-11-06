import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAuth } from "react-oidc-context";
import SignOutButton, { getLogoutUrl } from "@/components/auth/SignOutButton";

import { redirectTo } from "@/components/auth/redirect";

jest.mock("react-oidc-context", () => ({ useAuth: jest.fn() }));
jest.mock("@/components/auth/redirect");

const removeUser = jest.fn();
const assign = jest.mocked(redirectTo);

beforeEach(() => {
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN =
    "https://kanban.auth.ap-southeast-2.amazoncognito.com";
  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID = "client123";
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  removeUser.mockReset().mockResolvedValue(undefined);
  assign.mockReset();
  jest.mocked(useAuth).mockReturnValue({
    user: { profile: { email: "me@example.com" } },
    removeUser,
  } as unknown as ReturnType<typeof useAuth>);
});

describe("SignOutButton", () => {
  it("shows the signed-in user's email", () => {
    render(<SignOutButton />);

    expect(screen.getByText("me@example.com")).toBeInTheDocument();
  });

  it("builds the Cognito logout URL with the app as the return address", () => {
    expect(getLogoutUrl()).toBe(
      "https://kanban.auth.ap-southeast-2.amazoncognito.com/logout" +
        "?client_id=client123&logout_uri=http%3A%2F%2Flocalhost%3A3000",
    );
  });

  it("clears the local session, then signs out of Cognito", async () => {
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(assign).toHaveBeenCalledWith(getLogoutUrl()));
    expect(removeUser).toHaveBeenCalledTimes(1);
    expect(removeUser.mock.invocationCallOrder[0]).toBeLessThan(
      assign.mock.invocationCallOrder[0],
    );
  });
});

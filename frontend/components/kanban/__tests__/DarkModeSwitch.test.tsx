import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import DarkModeSwitch from "@/components/kanban/DarkModeSwitch";

jest.mock("next-themes", () => ({ useTheme: jest.fn() }));
const mockUseTheme = jest.mocked(useTheme);

const setTheme = jest.fn();

const renderWithTheme = (resolvedTheme: string) => {
  mockUseTheme.mockReturnValue({
    resolvedTheme,
    setTheme,
    themes: [],
  });
  render(<DarkModeSwitch />);
  return screen.getByRole("switch", { name: "Dark mode" });
};

beforeEach(() => {
  setTheme.mockReset();
});

describe("DarkModeSwitch", () => {
  it("is off in light mode", () => {
    expect(renderWithTheme("light")).not.toBeChecked();
  });

  it("is on in dark mode", () => {
    expect(renderWithTheme("dark")).toBeChecked();
  });

  it("switches to dark mode when turned on", () => {
    fireEvent.click(renderWithTheme("light"));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light mode when turned off", () => {
    fireEvent.click(renderWithTheme("dark"));

    expect(setTheme).toHaveBeenCalledWith("light");
  });
});

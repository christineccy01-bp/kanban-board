import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchInput from "@/components/ui/SearchInput";

const ControlledSearch = () => {
  const [value, setValue] = useState("");
  return <SearchInput value={value} onValueChange={setValue} />;
};

describe("SearchInput", () => {
  it("is labelled for screen readers", () => {
    render(<ControlledSearch />);

    expect(
      screen.getByRole("searchbox", { name: "Search tasks" }),
    ).toBeInTheDocument();
  });

  it("calls onValueChange as the user types", () => {
    const onValueChange = jest.fn();
    render(<SearchInput value="" onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "api" },
    });

    expect(onValueChange).toHaveBeenCalledWith("api");
  });

  it("only shows the clear button when there is text", () => {
    render(<ControlledSearch />);

    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "api" },
    });

    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument();
  });

  it("clears the text when the clear button is clicked", () => {
    render(<ControlledSearch />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "api" } });

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(input).toHaveValue("");
  });

  it("clears the text when Escape is pressed", () => {
    render(<ControlledSearch />);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "api" } });

    fireEvent.keyDown(input, { key: "Escape" });

    expect(input).toHaveValue("");
  });
});

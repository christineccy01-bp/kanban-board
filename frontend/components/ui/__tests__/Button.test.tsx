import { fireEvent, render, screen } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("defaults to type button so it does not submit forms", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows the type to be overridden", () => {
    render(<Button type="submit">Save</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("uses the primary variant by default", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).toHaveClass("bg-slate-900");
  });

  it("applies the requested variant", () => {
    render(<Button variant="danger">Delete</Button>);

    expect(screen.getByRole("button")).toHaveClass("text-red-600");
  });

  it("appends a custom className", () => {
    render(<Button className="w-full">Save</Button>);

    expect(screen.getByRole("button")).toHaveClass("w-full", "inline-flex");
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Save</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});

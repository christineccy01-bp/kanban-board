import { fireEvent, render, screen } from "@testing-library/react";
import InputField from "@/components/ui/InputField";

describe("InputField", () => {
  it("associates the label with a text input by default", () => {
    render(<InputField id="title" label="Title" />);

    const input = screen.getByLabelText("Title");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders the requested input type", () => {
    render(<InputField id="email" label="Email" type="email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("renders a textarea when type is textarea", () => {
    render(
      <InputField id="desc" label="Description" type="textarea" rows={4} />,
    );

    const textarea = screen.getByLabelText("Description");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).not.toHaveAttribute("type");
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("passes through value, onChange and other native props", () => {
    const onChange = jest.fn();
    render(
      <InputField
        id="title"
        label="Title"
        value="Draft"
        onChange={onChange}
        required
      />,
    );
    const input = screen.getByLabelText("Title");

    fireEvent.change(input, { target: { value: "Final" } });

    expect(input).toHaveValue("Draft");
    expect(input).toBeRequired();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("appends a custom className to the control", () => {
    render(<InputField id="title" label="Title" className="font-bold" />);

    expect(screen.getByLabelText("Title")).toHaveClass("font-bold", "w-full");
  });

  describe("required", () => {
    it("treats spaces-only text as missing", () => {
      render(
        <InputField
          id="title"
          label="Title"
          required
          value="   "
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByLabelText("Title")).toBeInvalid();
    });

    it("treats spaces-only text in a textarea as missing", () => {
      render(
        <InputField
          id="desc"
          label="Description"
          type="textarea"
          required
          value="   "
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByLabelText("Description")).toBeInvalid();
    });

    it("is valid once it has real text", () => {
      render(
        <InputField
          id="title"
          label="Title"
          required
          value=" Hi "
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByLabelText("Title")).toBeValid();
    });

    it("allows spaces-only text when not required", () => {
      render(
        <InputField
          id="title"
          label="Title"
          value="   "
          onChange={jest.fn()}
        />,
      );

      expect(screen.getByLabelText("Title")).toBeValid();
    });
  });
});

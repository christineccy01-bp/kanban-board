import { fireEvent, render, screen } from "@testing-library/react";
import Dropdown from "@/components/ui/Dropdown";

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
];

const openDropdown = () =>
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });

describe("Dropdown", () => {
  it("associates the label with the trigger", () => {
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="a"
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeInTheDocument();
  });

  it("shows the label of the selected option", () => {
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="b"
        onValueChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });

  it("uses renderOption for the selected value and the options", () => {
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="a"
        onValueChange={jest.fn()}
        renderOption={(option) => `${option.label}!`}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Apple!");
    openDropdown();
    expect(screen.getByRole("option", { name: "Banana!" })).toBeInTheDocument();
  });

  it("lists every option when opened", () => {
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="a"
        onValueChange={jest.fn()}
      />,
    );

    openDropdown();

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("calls onValueChange with the chosen value", () => {
    const onValueChange = jest.fn();
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="a"
        onValueChange={onValueChange}
      />,
    );

    openDropdown();
    fireEvent.click(screen.getByRole("option", { name: "Banana" }));

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("disables the trigger when disabled", () => {
    render(
      <Dropdown
        id="fruit"
        label="Fruit"
        options={options}
        value="a"
        onValueChange={jest.fn()}
        disabled
      />,
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

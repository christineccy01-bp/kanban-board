import { act, fireEvent, render, screen } from "@testing-library/react";
import ConfirmModal, {
  ConfirmModalProps,
} from "@/components/kanban/ConfirmModal";

const renderConfirm = (props: Partial<ConfirmModalProps> = {}) =>
  render(
    <ConfirmModal
      open
      onOpenChange={jest.fn()}
      title="Delete Task"
      onConfirm={jest.fn().mockResolvedValue(undefined)}
      {...props}
    >
      Are you sure?
    </ConfirmModal>,
  );

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ConfirmModal", () => {
  it("renders the title and message", () => {
    renderConfirm();

    expect(
      screen.getByRole("dialog", { name: "Delete Task" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("uses Confirm as the default confirm label", () => {
    renderConfirm();

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("uses a custom confirm label", () => {
    renderConfirm({ confirmLabel: "Delete" });

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Cancel is clicked", () => {
    const onOpenChange = jest.fn();
    renderConfirm({ onOpenChange });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables the confirm button while onConfirm is pending", async () => {
    let resolve!: () => void;
    const onConfirm = jest.fn(() => new Promise<void>((r) => (resolve = r)));
    renderConfirm({ onConfirm });
    const confirm = screen.getByRole("button", { name: "Confirm" });

    fireEvent.click(confirm);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirm).toBeDisabled();

    await act(async () => resolve());

    expect(confirm).toBeEnabled();
  });

  it("logs and re-enables the button when onConfirm fails", async () => {
    const error = new Error("boom");
    renderConfirm({
      confirmLabel: "Delete",
      onConfirm: jest.fn().mockRejectedValue(error),
    });
    const confirm = screen.getByRole("button", { name: "Delete" });

    await act(async () => fireEvent.click(confirm));

    expect(console.error).toHaveBeenCalledWith("Failed to delete:", error);
    expect(confirm).toBeEnabled();
  });
});

import { render, screen } from "@testing-library/react";
import StatusTag from "@/components/kanban/StatusBadge";
import { TaskStatus } from "@/utils/types";

describe("StatusTag", () => {
  it.each<[TaskStatus, string]>([
    ["N", "New"],
    ["P", "In Progress"],
    ["D", "Done"],
    ["A", "Archive"],
  ])("renders status %s as %s", (status, label) => {
    render(<StatusTag status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("gives each status its own colour", () => {
    render(<StatusTag status="D" />);

    expect(screen.getByText("Done")).toHaveClass("bg-emerald-100");
  });
});

import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import * as todoApi from "@/api/todoApi";
import { TasksProvider, useTasks } from "@/context/TasksContext";
import { CardProps } from "@/components/kanban/TaskCard";

jest.mock("@/api/todoApi");
const api = jest.mocked(todoApi);

const research: CardProps = {
  id: "1",
  title: "Research Project",
  description: "Gather requirements",
  status: "N",
  createdAt: 0,
};
const design: CardProps = {
  id: "2",
  title: "Design System",
  description: "Component library",
  status: "P",
  createdAt: 0,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <TasksProvider>{children}</TasksProvider>
);

const renderTasks = async () => {
  const hook = renderHook(() => useTasks(), { wrapper });
  await waitFor(() => expect(hook.result.current.tasks).toHaveLength(2));
  return hook;
};

beforeEach(() => {
  jest.resetAllMocks();
  api.getTasks.mockResolvedValue([research, design]);
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("TasksContext", () => {
  it("loads tasks on mount", async () => {
    const { result } = await renderTasks();

    expect(api.getTasks).toHaveBeenCalledTimes(1);
    expect(result.current.tasks).toEqual([research, design]);
  });

  it("createTask appends the task returned by the API", async () => {
    const created = { ...research, id: "3", title: "New task" };
    api.createTask.mockResolvedValue(created);
    const { result } = await renderTasks();

    await act(() =>
      result.current.createTask({
        title: "New task",
        description: "",
        status: "N",
      }),
    );

    expect(result.current.tasks.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });

  it("updateTask applies the changes immediately", async () => {
    let resolveUpdate!: () => void;
    api.updateTask.mockReturnValue(
      new Promise((resolve) => (resolveUpdate = () => resolve(research))),
    );
    const { result } = await renderTasks();
    const changes = {
      title: "Renamed",
      description: "d",
      status: "D" as const,
    };

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.updateTask("1", changes);
    });

    expect(result.current.tasks[0]).toMatchObject(changes);
    await act(async () => {
      resolveUpdate();
      await pending;
    });
    expect(api.updateTask).toHaveBeenCalledWith("1", changes);
  });

  it("updateTask rolls back and rethrows when the API fails", async () => {
    api.updateTask.mockRejectedValue(new Error("boom"));
    const { result } = await renderTasks();

    await act(async () => {
      await expect(
        result.current.updateTask("1", {
          title: "Renamed",
          description: "d",
          status: "D",
        }),
      ).rejects.toThrow("boom");
    });

    expect(result.current.tasks[0]).toEqual(research);
  });

  it("deleteTask removes the task after the API succeeds", async () => {
    api.deleteTask.mockResolvedValue(undefined);
    const { result } = await renderTasks();

    await act(() => result.current.deleteTask("1"));

    expect(api.deleteTask).toHaveBeenCalledWith("1");
    expect(result.current.tasks).toEqual([design]);
  });

  it("moveTask changes the status and saves the full task", async () => {
    api.updateTask.mockResolvedValue({ ...research, status: "D" });
    const { result } = await renderTasks();

    await act(() => result.current.moveTask("1", "D"));

    expect(result.current.tasks[0].status).toBe("D");
    expect(api.updateTask).toHaveBeenCalledWith("1", {
      title: research.title,
      description: research.description,
      status: "D",
    });
  });

  it("moveTask rolls back without throwing when the API fails", async () => {
    api.updateTask.mockRejectedValue(new Error("boom"));
    const { result } = await renderTasks();

    await act(() => result.current.moveTask("1", "D"));

    expect(result.current.tasks[0]).toEqual(research);
    expect(console.error).toHaveBeenCalled();
  });

  it("moveTask does nothing when dropped on the same column", async () => {
    const { result } = await renderTasks();

    await act(() => result.current.moveTask("1", "N"));

    expect(api.updateTask).not.toHaveBeenCalled();
  });

  it("a failed update only rolls back its own task", async () => {
    let rejectUpdate!: (err: Error) => void;
    api.updateTask
      .mockReturnValueOnce(new Promise((_, reject) => (rejectUpdate = reject)))
      .mockResolvedValueOnce({ ...design, status: "A" });
    const { result } = await renderTasks();

    let failing!: Promise<void>;
    act(() => {
      failing = result.current.moveTask("1", "D");
    });
    await act(() => result.current.moveTask("2", "A"));
    await act(async () => {
      rejectUpdate(new Error("boom"));
      await failing;
    });

    expect(result.current.tasks[0].status).toBe("N");
    expect(result.current.tasks[1].status).toBe("A");
  });

  it("useTasks throws outside a TasksProvider", () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      "useTasks must be used within a TasksProvider",
    );
  });
});

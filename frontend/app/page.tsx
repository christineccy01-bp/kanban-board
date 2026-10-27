import Board from "@/components/kanban/Board";
import { TasksProvider } from "@/context/TasksContext";

export default function Home() {
  return (
    <TasksProvider>
      <Board />
    </TasksProvider>
  );
}

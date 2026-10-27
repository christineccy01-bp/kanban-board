import KanbanBoard from "@/components/kanban/KanbanBoard";
import { TasksProvider } from "@/context/TasksContext";

export default function Home() {
  return (
    <TasksProvider>
      <KanbanBoard />
    </TasksProvider>
  );
}

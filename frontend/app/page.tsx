import AuthGate from "@/components/auth/AuthGate";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { TasksProvider } from "@/context/TasksContext";

export default function Home() {
  return (
    // TasksProvider fetches on mount, so it must only render once signed in
    <AuthGate>
      <TasksProvider>
        <KanbanBoard />
      </TasksProvider>
    </AuthGate>
  );
}

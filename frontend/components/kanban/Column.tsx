import { useDroppable } from "@dnd-kit/core";
import TaskCard, { TaskUpdateProps } from "./TaskCard";
import { TaskStatus } from "@/utils/types";
import { CardProps } from "./TaskCard";
import { STATUS_MAP } from "../../utils/constants";

export type ColumnProps = {
  id: TaskStatus;
  tasks: CardProps[];
  onUpdateTask: (taskId: string, changes: TaskUpdateProps) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
};

const Column = ({ id, tasks, onUpdateTask, onDeleteTask }: ColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-slate-200 dark:bg-neutral-950 p-4">
      <h2 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-100">{STATUS_MAP[id]}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return (
            <TaskCard 
              key={`task-${task.id}`} 
              id={task.id} 
              title={task.title} 
              description={task.description} 
              status={task.status} 
              createdAt={task.createdAt}
              onUpdate={(changes) => onUpdateTask(task.id, changes)}
              onDelete={() => onDeleteTask(task.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Column;
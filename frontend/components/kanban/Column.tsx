import { useDroppable } from "@dnd-kit/core";
import TaskCard, { TaskUpdateProps } from "./TaskCard";
import { ColumnType } from "../types";
import { CardProps } from "./TaskCard";

export type ColumnProps = {
  column: ColumnType;
  tasks: CardProps[];
  onUpdateTask: (taskId: string, changes: TaskUpdateProps) => Promise<void>;
};

const Column = ({ column, tasks, onUpdateTask}: ColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-slate-200 dark:bg-neutral-950 p-4">
      <h2 className="mb-4 font-semibold text-neutral-800 dark:text-neutral-100">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          console.log(task);
          return (
            <TaskCard 
              key={`task-${task.id}`} 
              id={task.id} 
              title={task.title} 
              description={task.description} 
              status={task.status} 
              createdAt={task.createdAt}
              onUpdate={(changes) => onUpdateTask(task.id, changes)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Column;
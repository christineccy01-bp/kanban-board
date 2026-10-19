export type TaskStatus = "new" | "in-progress" | "done" | "archive";

export type ColumnType = {
    id: TaskStatus;
    title: string;
}
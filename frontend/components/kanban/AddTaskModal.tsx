"use client";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import StatusTag from "./StatusBadge";
import InputField from "../ui/InputField";
import { SubmitEvent, useState } from 'react';
import { STATUS_OPTIONS } from "../../utils/constants";
import { TaskStatus } from "@/utils/types";

export type NewTaskInput = {
    title: string;
    description: string;
    status: TaskStatus;
};

export type AddTaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    popUpTitle: string;
    onCreate: (task: NewTaskInput) => Promise<void>;
}

const AddTaskModal = ({
    isOpen,
    onClose,
    popUpTitle,
    onCreate
}: AddTaskModalProps) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("N");

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onCreate({
                title: taskTitle.trim(),
                description: taskDescription.trim(),
                status,
            });
            setTaskTitle("");
            setTaskDescription("");
            setStatus("N");
            onClose();
        } catch (error) {
          console.error("Failed to create task:", error);
        }
      };


    return (
        <Modal
        open={isOpen}
        onOpenChange={onClose}
        title={popUpTitle}
        footer={
            <>
                <Button type="submit" form="add-task-form">
                    Save
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </>
        }
        >
        <form
            id="add-task-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-sm"
        >
            <InputField
                id="task-title"
                label="Title"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Dropdown
                id="task-status"
                label="Status"
                options={STATUS_OPTIONS}
                required
                value={status}
                onValueChange={setStatus}
                renderOption={(option) => <StatusTag status={option.value} />}
            />
            <InputField
                id="task-description"
                label="Description"
                type="textarea"
                rows={4}
                required
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
            />
        </form>
        </Modal>
    );
};



export default AddTaskModal;

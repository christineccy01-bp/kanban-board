"use client";

import Modal from "./Modal";
import Button from "./Button";
import InputField from "./InputField";
import { SubmitEvent, useState } from 'react';
import { STATUS_OPTIONS } from "../../utils/constants";

export type NewTaskInput = {
    title: string;
    description: string;
    status: string;
};

export type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    popUpTitle: string;
    onCreate: (task: NewTaskInput) => Promise<void>;
}

const Popup = ({
    isOpen,
    onClose,
    popUpTitle,
    onCreate
}: PopupProps) => {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [status, setStatus] = useState("N");

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await onCreate({ title: taskTitle, description: taskDescription, status });
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
            <InputField
                id="task-status"
                label="Status"
                type="select"
                options={STATUS_OPTIONS}
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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



export default Popup;

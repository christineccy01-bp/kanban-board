"use client";

import Modal from "./Modal";
import Button from "./Button";
import { FormEvent, useState } from 'react';

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        <dl className="flex flex-col gap-4 text-sm">
            <div className="flex flex-col gap-1">
            <dt className="font-medium text-slate-500 dark:text-slate-400">
                <form id="add-task-form" onSubmit={handleSubmit}>
                    
                    <div>
                        <label htmlFor="task-title">Title</label>
                        <input type="text" id="task-title" required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}/>
                    </div>
                    
                    <div>
                        <label htmlFor="task-description">Description</label>
                        <input type="text" id="task-description" required value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}/>
                    </div>

                    <div>
                        <label htmlFor="task-status">Status</label>
                        <select id="task-status" value={status} required onChange={(e)=> setStatus(e.target.value)}>
                            <option value="N">New</option>
                            <option value="P">In progress</option>
                            <option value="D">Done</option>
                            <option value="A">Archive</option>
                        </select>
                    </div>
                </form>
            </dt>
            </div>
        </dl>
        </Modal>
    );
};



export default Popup;
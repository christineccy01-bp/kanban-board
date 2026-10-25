"use client";

import { ReactNode, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";

export type ConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
};

const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel = "Confirm",
  onConfirm,
}: ConfirmModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error(`Failed to ${confirmLabel.toLowerCase()}:`, error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm">{children}</p>
    </Modal>
  );
};

export default ConfirmModal;

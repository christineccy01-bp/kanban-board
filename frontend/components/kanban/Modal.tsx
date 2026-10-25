"use client";

import { ReactNode } from "react";
import { Dialog } from "radix-ui";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-testid="modal-overlay"
          className="fixed inset-0 z-40 bg-black/50 motion-safe:data-[state=open]:animate-fade-in"
        />
        <Dialog.Content
          // Radix warns when there is no description unless this is explicitly undefined
          {...(!description && { "aria-describedby": undefined })}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg border border-neutral-200 bg-white text-neutral-900 shadow-lg focus:outline-none motion-safe:data-[state=open]:animate-modal-in dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <header className="flex items-start justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-700">
            <div>
              <Dialog.Title className="text-lg font-semibold leading-snug">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {description}
                </Dialog.Description>
              )}
            </div>
          </header>

          <div className="overflow-y-auto p-4">{children}</div>

          {footer && (
            <footer className="flex justify-end gap-2 border-t border-neutral-200 p-4 dark:border-neutral-700">
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;

"use client";

import { ReactNode } from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { FIELD_STYLES, LABEL_STYLES } from "./fieldStyles";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type DropdownProps<T extends string> = {
  id: string;
  label: string;
  options: SelectOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  // Custom content for each option and the selected value; defaults to the label
  renderOption?: (option: SelectOption<T>) => ReactNode;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const Dropdown = <T extends string>({
  id,
  label,
  options,
  value,
  onValueChange,
  renderOption = (option) => option.label,
  name,
  required,
  disabled,
  className = "",
}: DropdownProps<T>) => {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1">
      <label className={LABEL_STYLES} htmlFor={id}>
        {label}
      </label>
      <Select.Root
        value={value}
        onValueChange={(newValue) => onValueChange(newValue as T)}
        name={name}
        required={required}
        disabled={disabled}
      >
        <Select.Trigger
          id={id}
          className={`${FIELD_STYLES} flex cursor-pointer items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
          <Select.Value>{selected && renderOption(selected)}</Select.Value>
          <Select.Icon>
            <ChevronDown aria-hidden="true" className="size-4 text-neutral-500" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          {/* z-[60] keeps the list above the modal, which is z-50 */}
          <Select.Content
            position="popper"
            sideOffset={4}
            className="z-[60] max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 outline-none select-none data-highlighted:bg-neutral-100 dark:data-highlighted:bg-neutral-800"
                >
                  <Select.ItemText>{renderOption(option)}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default Dropdown;

import { ComponentProps } from "react";

const LABEL_STYLES = "font-medium text-slate-500 dark:text-neutral-400";

const FIELD_STYLES =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-blue-500 dark:focus-visible:ring-neutral-600";

export type SelectOption = {
  value: string;
  label: string;
};

type BaseFieldProps = {
  id: string;
  label: string;
};

type TextInputFieldProps = BaseFieldProps &
  Omit<ComponentProps<"input">, "id" | "type"> & {
    type?: "text" | "email" | "number" | "password" | "date" | "url";
  };

type SelectFieldProps = BaseFieldProps &
  Omit<ComponentProps<"select">, "id"> & {
    type: "select";
    options: SelectOption[];
  };

type TextareaFieldProps = BaseFieldProps &
  Omit<ComponentProps<"textarea">, "id"> & {
    type: "textarea";
  };

// Omit that keeps each member of a union separate, so narrowing on `type` still works
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type InputFieldProps =
  | TextInputFieldProps
  | SelectFieldProps
  | TextareaFieldProps;

const InputField = ({ label, ...props }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className={LABEL_STYLES} htmlFor={props.id}>
        {label}
      </label>
      <FieldControl {...props} />
    </div>
  );
};

// Narrowing on `type` lets each branch spread only the props valid for that element
const FieldControl = (props: DistributiveOmit<InputFieldProps, "label">) => {
  if (props.type === "select") {
    const { options, className = "", type: _type, ...selectProps } = props;
    return (
      <select className={`${FIELD_STYLES} ${className}`} {...selectProps}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (props.type === "textarea") {
    const { className = "", type: _type, ...textareaProps } = props;
    return (
      <textarea
        className={`${FIELD_STYLES} resize-y ${className}`}
        {...textareaProps}
      />
    );
  }

  const { className = "", type = "text", ...inputProps } = props;
  return (
    <input
      type={type}
      className={`${FIELD_STYLES} ${className}`}
      {...inputProps}
    />
  );
};

export default InputField;

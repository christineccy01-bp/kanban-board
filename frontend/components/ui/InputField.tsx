import { ComponentProps } from "react";
import { FIELD_STYLES, LABEL_STYLES } from "./fieldStyles";

type BaseFieldProps = {
  id: string;
  label: string;
};

type TextInputFieldProps = BaseFieldProps &
  Omit<ComponentProps<"input">, "id" | "type"> & {
    type?: "text" | "email" | "number" | "password" | "date" | "url";
  };

type TextareaFieldProps = BaseFieldProps &
  Omit<ComponentProps<"textarea">, "id"> & {
    type: "textarea";
  };

// Omit that keeps each member of a union separate, so narrowing on `type` still works
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

export type InputFieldProps = TextInputFieldProps | TextareaFieldProps;

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

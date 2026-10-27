import { ComponentProps, useEffect, useRef } from "react";
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
  // Typed as both elements so the one ref can be attached in either branch
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const { required, value } = props;

  // `required` accepts whitespace-only text, so flag it as invalid ourselves.
  // Only controlled fields are checked, since `value` is what we inspect
  useEffect(() => {
    const isBlank = value !== undefined && String(value).trim() === "";
    ref.current?.setCustomValidity(
      required && isBlank ? "Please fill out this field." : "",
    );
  }, [required, value]);

  if (props.type === "textarea") {
    const { className = "", type: _type, ...textareaProps } = props;
    return (
      <textarea
        ref={ref}
        className={`${FIELD_STYLES} resize-y ${className}`}
        {...textareaProps}
      />
    );
  }

  const { className = "", type = "text", ...inputProps } = props;
  return (
    <input
      ref={ref}
      type={type}
      className={`${FIELD_STYLES} ${className}`}
      {...inputProps}
    />
  );
};

export default InputField;

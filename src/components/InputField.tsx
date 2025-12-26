import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  textarea?: boolean;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  textarea,
  placeholder,
  inputProps,
}: InputFieldProps) => {
  if (hidden) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {textarea ? (
        <textarea
          {...register(name)}
          className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring min-h-[80px] resize-y"
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...inputProps}
        />
      ) : (
        <input
          type={type}
          {...register(name)}
          className="ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring"
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...inputProps}
        />
      )}
      {error?.message && (
        <p className="text-xs text-destructive">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;

import { FieldError } from "react-hook-form";

type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  label: string;
  register: any;
  name: string;
  options: SelectOption[];
  defaultValue?: string | number | string[];
  error?: FieldError;
  disabled?: boolean;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

const SelectField = ({
  label,
  register,
  name,
  options,
  defaultValue,
  error,
  disabled = false,
  multiple = false,
  placeholder = "Select an option",
  className = "",
  required = false,
}: SelectFieldProps) => {
  const baseClasses = "ring-[1.5px] ring-border p-3 rounded-md text-sm w-full focus:ring-ring focus:border-ring";
  const errorClasses = error ? "ring-destructive border-destructive" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed bg-muted" : "";

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
        defaultValue={defaultValue}
        disabled={disabled}
        multiple={multiple}
      >
        {!multiple && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && (
        <p className="text-xs text-destructive">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default SelectField;
export type { SelectOption };


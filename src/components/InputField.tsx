import React from "react";

type InputFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  required,
  error,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <span className="mt-1 text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;

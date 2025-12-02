import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const SecondaryButton: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return (
    <button
      {...rest}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {label}
    </button>
  );
};

export default SecondaryButton;

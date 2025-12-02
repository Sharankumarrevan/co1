import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const PrimaryButton: React.FC<ButtonProps> = ({ label, ...rest }) => {
  return (
    <button
      {...rest}
      className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
    >
      {label}
    </button>
  );
};

export default PrimaryButton;

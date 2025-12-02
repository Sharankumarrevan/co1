import React from "react";

type FormCardProps = {
  title: string;
  children: React.ReactNode;
};

const FormCard: React.FC<FormCardProps> = ({ title, children }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </div>
  );
};

export default FormCard;

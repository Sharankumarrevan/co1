import React from "react";

type PageHeaderProps = {
  title: string;
  onAddNew?: () => void;
  addLabel?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, onAddNew, addLabel }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>

      {onAddNew && (
        <button
          type="button"
          onClick={onAddNew}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          {addLabel ?? "+ Add New"}
        </button>
      )}
    </div>
  );
};

export default PageHeader;

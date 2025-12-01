import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Designation } from "../types";
import { initialDesignations } from "../api/Designation";

// ✅ Yup schema – only two required fields
const designationSchema = yup.object({
  designationCode: yup.string().required("Designation Code is required"),
  designationName: yup.string().required("Designation Name is required"),
});

type DesignationFormValues = yup.InferType<typeof designationSchema>;

const DesignationPage: React.FC = () => {
  const [rows, setRows] = useState<Designation[]>(initialDesignations);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewDesignation, setViewDesignation] = useState<Designation | null>(
    null
  );

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DesignationFormValues>({
    resolver: yupResolver(designationSchema),
    defaultValues: {
      designationCode: "",
      designationName: "",
    },
  });

  // Prefill form when editing
  useEffect(() => {
    if (editingRow) {
      reset({
        designationCode: editingRow.designationCode,
        designationName: editingRow.designationName,
      });
    } else {
      reset({
        designationCode: "",
        designationName: "",
      });
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE
  const onSubmit = (data: DesignationFormValues) => {
    if (editingId === null) {
      const newRow: Designation = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      // 🔒 keep code same on update
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? { ...row, ...data, designationCode: row.designationCode }
            : row
        )
      );
    }

    setEditingId(null);
    reset();
    setIsFormOpen(false);
  };

  const handleEdit = (row: Designation) => {
    setEditingId(row.id);
    setIsFormOpen(true);
    setViewDesignation(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRows((prev) => prev.filter((row) => row.id !== id));
      if (editingId === id) {
        setEditingId(null);
        reset();
        setIsFormOpen(false);
      }
      if (viewDesignation && viewDesignation.id === id) {
        setViewDesignation(null);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Designation Master
          </h1>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              reset();
              setIsFormOpen(true);
              setViewDesignation(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Add New
          </button>
        </div>

        {/* 🔍 VIEW-ONLY PANEL */}
        {viewDesignation && (
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                View Designation
              </h2>
              <button
                type="button"
                onClick={() => setViewDesignation(null)}
                className="text-sm text-slate-500 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Designation Code
                </label>
                <input
                  value={viewDesignation.designationCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Designation Name
                </label>
                <input
                  value={viewDesignation.designationName}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        {isFormOpen && (
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              {editingId === null ? "Add Designation" : "Edit Designation"}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Designation Code (🔒 when editing) */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Designation Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("designationCode")}
                  readOnly={!!editingId}
                  className={
                    "rounded-lg px-3 py-2 text-sm outline-none " +
                    (editingId
                      ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                      : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")
                  }
                  placeholder="Enter Designation Code"
                />
                {errors.designationCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.designationCode.message}
                  </span>
                )}
              </div>

              {/* Designation Name */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Designation Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("designationName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Designation Name"
                />
                {errors.designationName && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.designationName.message}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-green-700"
                >
                  {editingId === null ? "Save" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Clear / Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-800">Data Table</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {rows.length} record{rows.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <th className="px-3 py-2">SL.NO</th>
                  <th className="px-3 py-2">Designation Code</th>
                  <th className="px-3 py-2">Designation Name</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-4 text-center text-sm text-slate-500"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">{row.designationCode}</td>
                      <td className="px-3 py-2">{row.designationName}</td>
                      <td className="px-3 py-2 text-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewDesignation(row)}
                          className="text-xs font-medium text-slate-700 hover:underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationPage;

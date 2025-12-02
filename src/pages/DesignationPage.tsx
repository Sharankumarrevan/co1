import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Designation } from "../types";
import { initialDesignations } from "../api/Designation";

import PageHeader from "../components/PageHeader";
import FormCard from "../components/FormCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ViewModal from "../components/ViewModal";

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
    setError, // 👈 needed for duplicate validation
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
      reset();
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE with duplicate check
  const onSubmit = (data: DesignationFormValues) => {
    // 🔍 1) DUPLICATE CHECK for designationCode
    const isDuplicate = rows.some(
      (row) =>
        row.designationCode.toLowerCase() ===
          data.designationCode.toLowerCase() &&
        row.id !== editingId // ignore same row when editing
    );

    if (isDuplicate) {
      setError("designationCode", {
        type: "manual",
        message: "Designation Code already exists. It must be unique.",
      });
      return; // ❌ stop save
    }

    // 2) Normal create / update
    if (editingId === null) {
      const newRow: Designation = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? { ...row, ...data, designationCode: row.designationCode } // 🔒 keep code fixed
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
        <PageHeader
          title="Designation Master"
          onAddNew={() => {
            setEditingId(null);
            reset();
            setIsFormOpen(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Form Card */}
        {isFormOpen && (
          <FormCard
            title={editingId === null ? "Add Designation" : "Edit Designation"}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <InputField
                label="Designation Code"
                required
                error={errors.designationCode?.message}
              >
                <input
                  {...register("designationCode")}
                  disabled={editingId !== null}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Designation Code"
                />
              </InputField>

              <InputField
                label="Designation Name"
                required
                error={errors.designationName?.message}
              >
                <input
                  {...register("designationName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Designation Name"
                />
              </InputField>

              <div className="mt-4 flex gap-3 md:col-span-2">
                <PrimaryButton
                  type="submit"
                  label={editingId === null ? "Save" : "Update"}
                />
                <SecondaryButton
                  type="button"
                  label="Clear / Cancel"
                  onClick={handleCancel}
                />
              </div>
            </form>
          </FormCard>
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

      {/* View-only Modal */}
      <ViewModal
        title="View Designation"
        isOpen={!!viewDesignation}
        onClose={() => setViewDesignation(null)}
      >
        {viewDesignation && (
          <div className="grid gap-4 text-sm">
            <div>
              <strong>Designation Code:</strong>
              <div>{viewDesignation.designationCode}</div>
            </div>
            <div>
              <strong>Designation Name:</strong>
              <div>{viewDesignation.designationName}</div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
};

export default DesignationPage;

import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Subsidiary } from "../types";
import { initialSubsidiaries } from "../api/subsidary";

import PageHeader from "../components/PageHeader";
import FormCard from "../components/FormCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ViewModal from "../components/ViewModal";

// ✅ Yup validation schema
const subsidiarySchema = yup.object({
  subsidiaryName: yup.string().required("Subsidiary Name is required"),
  subsidiaryCode: yup
    .string()
    .required("Subsidiary Code is required")
    .max(20, "Max 20 characters"),
  subsidiaryDescription: yup
    .string()
    .required("Subsidiary Description is required"),
  locationCode: yup.string().required("Location Code is required"),
  organizationCode: yup.string().required("Organization Code is required"),
});

type SubsidiaryFormValues = yup.InferType<typeof subsidiarySchema>;

const SubsidiaryPage: React.FC = () => {
  const [rows, setRows] = useState<Subsidiary[]>(initialSubsidiaries);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewSubsidiary, setViewSubsidiary] = useState<Subsidiary | null>(null);

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const {
    register,
    handleSubmit,
    reset,
    setError, // 👈 for duplicate validation
    formState: { errors },
  } = useForm<SubsidiaryFormValues>({
    resolver: yupResolver(subsidiarySchema),
    defaultValues: {
      subsidiaryName: "",
      subsidiaryCode: "",
      subsidiaryDescription: "",
      locationCode: "",
      organizationCode: "",
    },
  });

  // when we click Edit, pre-fill the form
  useEffect(() => {
    if (editingRow) {
      reset({
        subsidiaryName: editingRow.subsidiaryName,
        subsidiaryCode: editingRow.subsidiaryCode,
        subsidiaryDescription: editingRow.subsidiaryDescription,
        locationCode: editingRow.locationCode,
        organizationCode: editingRow.organizationCode,
      });
    } else {
      reset();
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE with duplicate check
  const onSubmit = (data: SubsidiaryFormValues) => {
    // 🔍 1) DUPLICATE CHECK for subsidiaryCode
    const isDuplicate = rows.some(
      (row) =>
        row.subsidiaryCode.toLowerCase() ===
          data.subsidiaryCode.toLowerCase() && row.id !== editingId
    );

    if (isDuplicate) {
      setError("subsidiaryCode", {
        type: "manual",
        message: "Subsidiary Code already exists. It must be unique.",
      });
      return; // ❌ stop save
    }

    // 2) Normal create / update
    if (editingId === null) {
      const newRow: Subsidiary = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? { ...row, ...data, subsidiaryCode: row.subsidiaryCode } // keep code fixed
            : row
        )
      );
    }

    setEditingId(null);
    reset();
    setIsFormOpen(false);
  };

  const handleEdit = (row: Subsidiary) => {
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
          title="Subsidiary Master"
          onAddNew={() => {
            setEditingId(null);
            reset();
            setIsFormOpen(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Form */}
        {isFormOpen && (
          <FormCard
            title={editingId === null ? "Add Subsidiary" : "Edit Subsidiary"}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Subsidiary Name */}
              <InputField
                label="Subsidiary Name"
                required
                error={errors.subsidiaryName?.message}
              >
                <input
                  {...register("subsidiaryName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Subsidiary Name"
                />
              </InputField>

              {/* Subsidiary Code */}
              <InputField
                label="Subsidiary Code"
                required
                error={errors.subsidiaryCode?.message}
              >
                <input
                  {...register("subsidiaryCode")}
                  disabled={editingId !== null}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Subsidiary Code"
                />
              </InputField>

              {/* Subsidiary Description */}
              <InputField
                label="Subsidiary Description"
                required
                error={errors.subsidiaryDescription?.message}
              >
                <input
                  {...register("subsidiaryDescription")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Description"
                />
              </InputField>

              {/* Location Code */}
              <InputField
                label="Location Code"
                required
                error={errors.locationCode?.message}
              >
                <input
                  {...register("locationCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Location Code"
                />
              </InputField>

              {/* Organization Code */}
              <InputField
                label="Organization Code"
                required
                error={errors.organizationCode?.message}
              >
                <input
                  {...register("organizationCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Organization Code"
                />
              </InputField>

              {/* Buttons */}
              <div className="mt-2 flex gap-3 md:col-span-2">
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
                  <th className="px-3 py-2">Subsidiary Name</th>
                  <th className="px-3 py-2">Subsidiary Code</th>
                  <th className="px-3 py-2">Subsidiary Description</th>
                  <th className="px-3 py-2">Location Code</th>
                  <th className="px-3 py-2">Organization Code</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
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
                      <td className="px-3 py-2">{row.subsidiaryName}</td>
                      <td className="px-3 py-2">{row.subsidiaryCode}</td>
                      <td className="px-3 py-2">
                        {row.subsidiaryDescription}
                      </td>
                      <td className="px-3 py-2">{row.locationCode}</td>
                      <td className="px-3 py-2">{row.organizationCode}</td>
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
                          onClick={() => setViewSubsidiary(row)}
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
        title="View Subsidiary"
        isOpen={!!viewSubsidiary}
        onClose={() => setViewSubsidiary(null)}
      >
        {viewSubsidiary && (
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <strong>Subsidiary Name:</strong>
              <div>{viewSubsidiary.subsidiaryName}</div>
            </div>
            <div>
              <strong>Subsidiary Code:</strong>
              <div>{viewSubsidiary.subsidiaryCode}</div>
            </div>
            <div>
              <strong>Description:</strong>
              <div>{viewSubsidiary.subsidiaryDescription}</div>
            </div>
            <div>
              <strong>Location Code:</strong>
              <div>{viewSubsidiary.locationCode}</div>
            </div>
            <div>
              <strong>Organization Code:</strong>
              <div>{viewSubsidiary.organizationCode}</div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
};

export default SubsidiaryPage;

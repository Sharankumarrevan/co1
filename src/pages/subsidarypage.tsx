import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Subsidiary } from "../types";
import { initialSubsidiaries } from "../api/subsidary";

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
  const [isFormOpen, setIsFormOpen] = useState(false); // show/hide form
  const [viewSub, setViewSub] = useState<Subsidiary | null>(null); // view-only panel

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
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
      reset({
        subsidiaryName: "",
        subsidiaryCode: "",
        subsidiaryDescription: "",
        locationCode: "",
        organizationCode: "",
      });
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE
  const onSubmit = (data: SubsidiaryFormValues) => {
    if (editingId === null) {
      const newRow: Subsidiary = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      // 🔒 Do not allow subsidiaryCode change when editing
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                ...data,
                subsidiaryCode: row.subsidiaryCode,
              }
            : row
        )
      );
    }
    setEditingId(null);
    reset();
    setIsFormOpen(false); // close form
  };

  const handleEdit = (row: Subsidiary) => {
    setEditingId(row.id);
    setIsFormOpen(true);
    setViewSub(null); // hide view panel when editing
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
      if (viewSub && viewSub.id === id) {
        setViewSub(null);
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
            Subsidiary Master
          </h1>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              reset();
              setIsFormOpen(true);
              setViewSub(null); // hide view when adding
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Add New
          </button>
        </div>

        {/* 🔍 VIEW-ONLY PANEL */}
        {viewSub && (
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                View Subsidiary
              </h2>
              <button
                type="button"
                onClick={() => setViewSub(null)}
                className="text-sm text-slate-500 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Subsidiary Name
                </label>
                <input
                  value={viewSub.subsidiaryName}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Subsidiary Code
                </label>
                <input
                  value={viewSub.subsidiaryCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Subsidiary Description
                </label>
                <input
                  value={viewSub.subsidiaryDescription}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location Code
                </label>
                <input
                  value={viewSub.locationCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization Code
                </label>
                <input
                  value={viewSub.organizationCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {isFormOpen && (
          <div className="rounded-xl bg-white p-5 shadow">
            <h2 className="mb-4 text-lg font-medium text-slate-800">
              {editingId === null
                ? "Add Subsidiary"
                : `Edit Subsidiary #${editingId}`}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Subsidiary Name */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Subsidiary Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subsidiaryName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Subsidiary Name"
                />
                {errors.subsidiaryName && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.subsidiaryName.message}
                  </span>
                )}
              </div>

              {/* Subsidiary Code (🔒 locked when editing) */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Subsidiary Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subsidiaryCode")}
                  readOnly={!!editingId}
                  className={
                    "rounded-lg px-3 py-2 text-sm outline-none " +
                    (editingId
                      ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                      : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")
                  }
                  placeholder="Enter Subsidiary Code"
                />
                {errors.subsidiaryCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.subsidiaryCode.message}
                  </span>
                )}
              </div>

              {/* Subsidiary Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Subsidiary Description{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("subsidiaryDescription")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Description"
                />
                {errors.subsidiaryDescription && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.subsidiaryDescription.message}
                  </span>
                )}
              </div>

              {/* Location Code */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Location Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("locationCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Location Code"
                />
                {errors.locationCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.locationCode.message}
                  </span>
                )}
              </div>

              {/* Organization Code */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Organization Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("organizationCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Organization Code"
                />
                {errors.organizationCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.organizationCode.message}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-2 flex gap-3 md:col-span-2">
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
                          onClick={() => setViewSub(row)}
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

export default SubsidiaryPage;

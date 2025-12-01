import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Organization } from "../types";
import { initialOrganizations } from "../api/organizations";

// ✅ Yup schema (NO addressLine2)
const organizationSchema = yup.object({
  organizationName: yup.string().required("Organization Name is required"),
  organizationCode: yup.string().required("Organization Code is required"),
  registrationNumber: yup
    .string()
    .required("Registration Number is required"),
  emailId: yup
    .string()
    .email("Invalid email")
    .required("Email ID is required"),
  contactNumber: yup
    .string()
    .required("Contact Number is required")
    .matches(/^[0-9]{8,15}$/, "Contact must be 8–15 digits"),
  addressLine1: yup.string().required("Address Line 1 is required"),
  city: yup.string().required("City is required"),
  pinCode: yup
    .string()
    .required("Pin Code is required")
    .matches(/^[0-9]{5,6}$/, "Pin Code must be 5–6 digits"),
  tenantCode: yup.string().required("Tenant Code is required"),
  status: yup.string().required("Status is required"),
  financialYearStart: yup.string().required("Financial Year Start is required"),
});

type OrganizationFormValues = yup.InferType<typeof organizationSchema>;

const OrganizationPage: React.FC = () => {
  const [rows, setRows] = useState<Organization[]>(initialOrganizations);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // show/hide edit/add form
  const [viewOrg, setViewOrg] = useState<Organization | null>(null); // view-only modal

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const {
    register,
    handleSubmit,
    reset,
    setError, // to show error down the box
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: yupResolver(organizationSchema),
    defaultValues: {
      organizationName: "",
      organizationCode: "",
      registrationNumber: "",
      emailId: "",
      contactNumber: "",
      addressLine1: "",
      city: "",
      pinCode: "",
      tenantCode: "",
      status: "",
      financialYearStart: "",
    },
  });

  // Pre-fill form on Edit
  useEffect(() => {
    if (editingRow) {
      reset({
        organizationName: editingRow.organizationName,
        organizationCode: editingRow.organizationCode,
        registrationNumber: editingRow.registrationNumber,
        emailId: editingRow.emailId,
        contactNumber: editingRow.contactNumber,
        addressLine1: editingRow.addressLine1,
        city: editingRow.city,
        pinCode: editingRow.pinCode,
        tenantCode: editingRow.tenantCode,
        status: editingRow.status,
        financialYearStart: editingRow.financialYearStart,
      });
    } else {
      reset({
        organizationName: "",
        organizationCode: "",
        registrationNumber: "",
        emailId: "",
        contactNumber: "",
        addressLine1: "",
        city: "",
        pinCode: "",
        tenantCode: "",
        status: "",
        financialYearStart: "",
      });
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE
const onSubmit = (data: OrganizationFormValues) => {
  // ✅ CHECK FOR DUPLICATE ORG CODE
  const isDuplicate = rows.some(
    (row) =>
      row.organizationCode.toLowerCase() ===
        data.organizationCode.toLowerCase() &&
      row.id !== editingId
  );

  if (isDuplicate) {
    setError("organizationCode", {
      type: "manual",
      message: "Organization Code already exists. It must be unique.",
    });
    return; // ❌ STOP SAVE
  }

  if (editingId === null) {
    const newRow: Organization = {
      id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
      ...data,
    };

    setRows((prev) => [...prev, newRow]);
  } else {
    setRows((prev) =>
      prev.map((row) =>
        row.id === editingId
          ? { ...row, ...data, organizationCode: row.organizationCode }
          : row
      )
    );
  }

  setEditingId(null);
  reset();
  setIsFormOpen(false); // ✅ close form
};



  const handleEdit = (row: Organization) => {
    setEditingId(row.id);
    setIsFormOpen(true); // open form with that row
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
    setIsFormOpen(false); // hide form
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Organization Master
          </h1>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              reset();
              setIsFormOpen(true); // open empty form
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Add New
          </button>
        </div>

        {/* Form Card – only when isFormOpen */}
        {isFormOpen && (
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              {editingId === null ? "Add Organization" : "Edit Organization"}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Organization Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization Name *
                </label>
                <input
                  {...register("organizationName")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.organizationName?.message}
                </p>
              </div>

              {/* Organization Code */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization Code *
                </label>
                <input
                  {...register("organizationCode")}
                  readOnly={!!editingId} 
                  className={"w-full rounded-md border px-3 py-2" + (editingId ?
                     "bg-slate-100 cursor-not-allowed" : "" )}
                />
                <p className="text-xs text-red-500">
                  {errors.organizationCode?.message}
                </p>
              </div>

              {/* Registration Number */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Registration Number *
                </label>
                <input
                  {...register("registrationNumber")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.registrationNumber?.message}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email *
                </label>
                <input
                  {...register("emailId")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.emailId?.message}
                </p>
              </div>

              {/* Contact Number */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Contact Number *
                </label>
                <input
                  {...register("contactNumber")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.contactNumber?.message}
                </p>
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address Line 1 *
                </label>
                <input
                  {...register("addressLine1")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.addressLine1?.message}
                </p>
              </div>

              {/* City */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  City *
                </label>
                <input
                  {...register("city")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">{errors.city?.message}</p>
              </div>

              {/* Pin Code */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Pin Code *
                </label>
                <input
                  {...register("pinCode")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.pinCode?.message}
                </p>
              </div>

              {/* Tenant Code */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tenant Code *
                </label>
                <input
                  {...register("tenantCode")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.tenantCode?.message}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status *
                </label>
                <input
                  {...register("status")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.status?.message}
                </p>
              </div>

              {/* Financial Year Start */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Financial Year Start *
                </label>
                <input
                  {...register("financialYearStart")}
                  className="w-full rounded-md border px-3 py-2"
                />
                <p className="text-xs text-red-500">
                  {errors.financialYearStart?.message}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex gap-4 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-6 py-2 text-white"
                >
                  {editingId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border px-6 py-2"
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
                  <th className="px-3 py-2">Organization Name</th>
                  <th className="px-3 py-2">Organization Code</th>
                  <th className="px-3 py-2">Registration No</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">City</th>
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
                      <td className="px-3 py-2">{row.organizationName}</td>
                      <td className="px-3 py-2">{row.organizationCode}</td>
                      <td className="px-3 py-2">{row.registrationNumber}</td>
                      <td className="px-3 py-2">{row.emailId}</td>
                      <td className="px-3 py-2">{row.city}</td>
                      <td className="px-3 py-2 text-center">

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEdit(row)}
                          className="mr-3 text-xs font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        {/* View – read only */}
                        <button
                          type = "button"
                          onClick={() => setViewOrg(row)}
                          className="mr-3 text-xs font-medium text-slate-700 hover:underline"
                          >
                            view

                        </button>

                        {/* Delete */}
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

      {/* View-only FORM-style modal */}
      {viewOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-5 text-lg font-semibold text-slate-800">
              View Organization
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization Name
                </label>
                <input
                  value={viewOrg.organizationName}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Organization Code
                </label>
                <input
                  value={viewOrg.organizationCode}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Registration Number
                </label>
                <input
                  value={viewOrg.registrationNumber}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  value={viewOrg.emailId}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Contact Number
                </label>
                <input
                  value={viewOrg.contactNumber}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address Line 1
                </label>
                <input
                  value={viewOrg.addressLine1}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  City
                </label>
                <input
                  value={viewOrg.city}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Pin Code
                </label>
                <input
                  value={viewOrg.pinCode}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tenant Code
                </label>
                <input
                  value={viewOrg.tenantCode}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>
                <input
                  value={viewOrg.status}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Financial Year Start
                </label>
                <input
                  value={viewOrg.financialYearStart}
                  readOnly
                  disabled
                  className="w-full rounded-md border px-3 py-2 bg-slate-100 text-slate-700"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewOrg(null)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;

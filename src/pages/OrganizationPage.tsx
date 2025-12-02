import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Organization } from "../types";
import { initialOrganizations } from "../api/organizations";

import PageHeader from "../components/PageHeader";
import FormCard from "../components/FormCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ViewModal from "../components/ViewModal";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewOrg, setViewOrg] = useState<Organization | null>(null);

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
      reset();
    }
  }, [editingRow, reset]);

  const onSubmit = (data: OrganizationFormValues) => {
    const orgCodeDuplicate = rows.some(
      (row) =>
        row.organizationCode.toLowerCase() ===
          data.organizationCode.toLowerCase() &&
        row.id !== editingId
    );

    if (orgCodeDuplicate) {
      setError("organizationCode", {
        type: "manual",
        message: "Organization Code already exists. It must be unique.",
      });
      return;
    }

    const tenantDuplicate = rows.some(
      (row) =>
        row.tenantCode.toLowerCase() === data.tenantCode.toLowerCase() &&
        row.id !== editingId
    );

    if (tenantDuplicate) {
      setError("tenantCode", {
        type: "manual",
        message: "Tenant Code already exists. It must be unique.",
      });
      return;
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
    setIsFormOpen(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    reset();
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (row: Organization) => {
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
        {/* Header (reusable) */}
        <PageHeader title="Organization Master" onAddNew={handleAddNew} />

        {/* Form (reusable pieces) */}
        {isFormOpen && (
          <FormCard title={editingId === null ? "Add Organization" : "Edit Organization"}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <InputField
                label="Organization Name"
                required
                error={errors.organizationName?.message}
              >
                <input
                  {...register("organizationName")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Organization Code"
                required
                error={errors.organizationCode?.message}
              >
                <input
                  {...register("organizationCode")}
                  disabled={editingId !== null}  
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Registration Number"
                required
                error={errors.registrationNumber?.message}
              >
                <input
                  {...register("registrationNumber")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Email"
                required
                error={errors.emailId?.message}
              >
                <input
                  {...register("emailId")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Contact Number"
                required
                error={errors.contactNumber?.message}
              >
                <input
                  {...register("contactNumber")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Address Line 1"
                required
                error={errors.addressLine1?.message}
              >
                <input
                  {...register("addressLine1")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="City"
                required
                error={errors.city?.message}
              >
                <input
                  {...register("city")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Pin Code"
                required
                error={errors.pinCode?.message}
              >
                <input
                  {...register("pinCode")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Tenant Code"
                required
                error={errors.tenantCode?.message}
              >
                <input
                  {...register("tenantCode")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Status"
                required
                error={errors.status?.message}
              >
                <input
                  {...register("status")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <InputField
                label="Financial Year Start"
                required
                error={errors.financialYearStart?.message}
              >
                <input
                  {...register("financialYearStart")}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </InputField>

              <div className="mt-5 flex gap-4 md:col-span-2">
                <PrimaryButton
                  type="submit"
                  label={editingId ? "Update" : "Save"}
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
                          onClick={() => setViewOrg(row)}
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

      {/* View-only Modal (reusable) */}
      <ViewModal
        title="View Organization"
        isOpen={!!viewOrg}
        onClose={() => setViewOrg(null)}
      >
        {viewOrg && (
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <strong>Organization Name:</strong>
              <div>{viewOrg.organizationName}</div>
            </div>
            <div>
              <strong>Organization Code:</strong>
              <div>{viewOrg.organizationCode}</div>
            </div>
            <div>
              <strong>Registration Number:</strong>
              <div>{viewOrg.registrationNumber}</div>
            </div>
            <div>
              <strong>Email:</strong>
              <div>{viewOrg.emailId}</div>
            </div>
            <div>
              <strong>Contact Number:</strong>
              <div>{viewOrg.contactNumber}</div>
            </div>
            <div>
              <strong>Address Line 1:</strong>
              <div>{viewOrg.addressLine1}</div>
            </div>
            <div>
              <strong>City:</strong>
              <div>{viewOrg.city}</div>
            </div>
            <div>
              <strong>Pin Code:</strong>
              <div>{viewOrg.pinCode}</div>
            </div>
            <div>
              <strong>Tenant Code:</strong>
              <div>{viewOrg.tenantCode}</div>
            </div>
            <div>
              <strong>Status:</strong>
              <div>{viewOrg.status}</div>
            </div>
            <div>
              <strong>Financial Year Start:</strong>
              <div>{viewOrg.financialYearStart}</div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
};

export default OrganizationPage;

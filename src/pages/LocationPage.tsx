import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Location } from "../types";
import { initialLocations } from "../api/locations";

import PageHeader from "../components/PageHeader";
import FormCard from "../components/FormCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ViewModal from "../components/ViewModal";

const locationSchema = yup.object({
  locationCode: yup.string().required("Location Code is required"),
  locationName: yup.string().required("Location Name is required"),
  regionCode: yup.string().required("Region Code is required"),
  countryCode: yup.string().required("Country Code is required"),
  stateCode: yup.string().required("State Code is required"),
  city: yup.string().required("City is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[0-9]{5,6}$/, "Pincode must be 5–6 digits"),
});

type LocationFormValues = yup.InferType<typeof locationSchema>;

const LocationPage: React.FC = () => {
  const [rows, setRows] = useState<Location[]>(initialLocations);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewLocation, setViewLocation] = useState<Location | null>(null);

  const editingRow = useMemo(
    () => rows.find((r) => r.id === editingId) ?? null,
    [rows, editingId]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: yupResolver(locationSchema),
    defaultValues: {
      locationCode: "",
      locationName: "",
      regionCode: "",
      countryCode: "",
      stateCode: "",
      city: "",
      pincode: "",
    },
  });
  
  useEffect(() => {
    if (editingRow) {
      reset({
        locationCode: editingRow.locationCode,
        locationName: editingRow.locationName,
        regionCode: editingRow.regionCode,
        countryCode: editingRow.countryCode,
        stateCode: editingRow.stateCode,
        city: editingRow.city,
        pincode: editingRow.pincode,
      });
    } else {
      reset();
    }
  }, [editingRow, reset]);

  const onSubmit = (data: LocationFormValues) => {
    const isDuplicate = rows.some(
      (row) =>
        row.locationCode.toLowerCase() === data.locationCode.toLowerCase() &&
        row.id !== editingId
    );

    if (isDuplicate) {
      setError("locationCode", {
        type: "manual",
        message: "Location Code already exists. It must be unique.",
      });
      return; 
    }

    if (editingId === null) {
      const newRow: Location = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? { ...row, ...data, locationCode: row.locationCode } 
            : row
        )
      );
    }

    setEditingId(null);
    reset();
    setIsFormOpen(false);
  };

  const handleEdit = (row: Location) => {
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
          title="Location Master"
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
            title={editingId === null ? "Add Location" : "Edit Location"}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <InputField
                label="Location Code"
                required
                error={errors.locationCode?.message}
              >
                <input
                  {...register("locationCode")}
                  disabled={editingId !== null}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Location Code"
                />
              </InputField>

              <InputField
                label="Location Name"
                required
                error={errors.locationName?.message}
              >
                <input
                  {...register("locationName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Location Name"
                />
              </InputField>

              <InputField
                label="Region Code"
                required
                error={errors.regionCode?.message}
              >
                <input
                  {...register("regionCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Region Code"
                />
              </InputField>

              <InputField
                label="Country Code"
                required
                error={errors.countryCode?.message}
              >
                <input
                  {...register("countryCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Country Code"
                />
              </InputField>

              <InputField
                label="State Code"
                required
                error={errors.stateCode?.message}
              >
                <input
                  {...register("stateCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter State Code"
                />
              </InputField>

              <InputField
                label="City"
                required
                error={errors.city?.message}
              >
                <input
                  {...register("city")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter City"
                />
              </InputField>

              <InputField
                label="Pincode"
                required
                error={errors.pincode?.message}
              >
                <input
                  {...register("pincode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Pincode"
                />
              </InputField>

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
                  <th className="px-3 py-2">Location Code</th>
                  <th className="px-3 py-2">Location Name</th>
                  <th className="px-3 py-2">Region Code</th>
                  <th className="px-3 py-2">Country Code</th>
                  <th className="px-3 py-2">State Code</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Pincode</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
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
                      <td className="px-3 py-2">{row.locationCode}</td>
                      <td className="px-3 py-2">{row.locationName}</td>
                      <td className="px-3 py-2">{row.regionCode}</td>
                      <td className="px-3 py-2">{row.countryCode}</td>
                      <td className="px-3 py-2">{row.stateCode}</td>
                      <td className="px-3 py-2">{row.city}</td>
                      <td className="px-3 py-2">{row.pincode}</td>
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
                          onClick={() => setViewLocation(row)}
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
        title="View Location"
        isOpen={!!viewLocation}
        onClose={() => setViewLocation(null)}
      >
        {viewLocation && (
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <strong>Location Code:</strong>
              <div>{viewLocation.locationCode}</div>
            </div>
            <div>
              <strong>Location Name:</strong>
              <div>{viewLocation.locationName}</div>
            </div>
            <div>
              <strong>Region Code:</strong>
              <div>{viewLocation.regionCode}</div>
            </div>
            <div>
              <strong>Country Code:</strong>
              <div>{viewLocation.countryCode}</div>
            </div>
            <div>
              <strong>State Code:</strong>
              <div>{viewLocation.stateCode}</div>
            </div>
            <div>
              <strong>City:</strong>
              <div>{viewLocation.city}</div>
            </div>
            <div>
              <strong>Pincode:</strong>
              <div>{viewLocation.pincode}</div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
};

export default LocationPage;

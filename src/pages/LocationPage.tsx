import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Location } from "../types";
import { initialLocations } from "../api/locations";

// ✅ Yup validation schema
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

  // Prefill form when editing
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
      reset({
        locationCode: "",
        locationName: "",
        regionCode: "",
        countryCode: "",
        stateCode: "",
        city: "",
        pincode: "",
      });
    }
  }, [editingRow, reset]);

  // CREATE / UPDATE
  const onSubmit = (data: LocationFormValues) => {
    if (editingId === null) {
      const newRow: Location = {
        id: rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1,
        ...data,
      };
      setRows((prev) => [...prev, newRow]);
    } else {
      // 🔒 do not allow locationCode change on update
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
    setViewLocation(null);
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
      if (viewLocation && viewLocation.id === id) {
        setViewLocation(null);
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
            Location Master
          </h1>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              reset();
              setIsFormOpen(true);
              setViewLocation(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            + Add New
          </button>
        </div>

        {/* 🔍 VIEW-ONLY PANEL */}
        {viewLocation && (
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                View Location
              </h2>
              <button
                type="button"
                onClick={() => setViewLocation(null)}
                className="text-sm text-slate-500 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location Code
                </label>
                <input
                  value={viewLocation.locationCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location Name
                </label>
                <input
                  value={viewLocation.locationName}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Region Code
                </label>
                <input
                  value={viewLocation.regionCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Country Code
                </label>
                <input
                  value={viewLocation.countryCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  State Code
                </label>
                <input
                  value={viewLocation.stateCode}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">City</label>
                <input
                  value={viewLocation.city}
                  readOnly
                  className="w-full rounded-md border bg-slate-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Pincode
                </label>
                <input
                  value={viewLocation.pincode}
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
              {editingId === null ? "Add Location" : `Edit Location #${editingId}`}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Location Code (🔒 when editing) */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Location Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("locationCode")}
                  readOnly={!!editingId}
                  className={
                    "rounded-lg px-3 py-2 text-sm outline-none " +
                    (editingId
                      ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                      : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500")
                  }
                  placeholder="Enter Location Code"
                />
                {errors.locationCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.locationCode.message}
                  </span>
                )}
              </div>

              {/* Location Name */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("locationName")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Location Name"
                />
                {errors.locationName && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.locationName.message}
                  </span>
                )}
              </div>

              {/* Region Code */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Region Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("regionCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Region Code"
                />
                {errors.regionCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.regionCode.message}
                  </span>
                )}
              </div>

              {/* Country Code */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Country Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("countryCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Country Code"
                />
                {errors.countryCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.countryCode.message}
                  </span>
                )}
              </div>

              {/* State Code */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  State Code <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("stateCode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter State Code"
                />
                {errors.stateCode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.stateCode.message}
                  </span>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("city")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter City"
                />
                {errors.city && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.city.message}
                  </span>
                )}
              </div>

              {/* Pincode */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-slate-700">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("pincode")}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter Pincode"
                />
                {errors.pincode && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.pincode.message}
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
    </div>
  );
};

export default LocationPage;


"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Stethoscope } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
};

const emptyForm = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

export default function DoctorsPage() {
  const { t, language } = usePreferences();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search");
    if (initialSearch) setSearch(initialSearch);
  }, []);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDoctors = useCallback(async () => {
    try {
      const result = await apiRequest("/doctors?limit=100");
      setDoctors(Array.isArray(result.data) ? result.data : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableLoadDoctors"));
    }
  }, [t]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const normalizedDoctorSearch = search.trim().toLocaleLowerCase();
  const filteredDoctors = doctors.filter((doctor) => {
    if (!normalizedDoctorSearch) return true;
    const searchableText = [
      doctor.name,
      doctor.specialization,
      doctor.hospital,
      doctor.email,
      doctor.phone,
    ].filter(Boolean).join(" ").toLocaleLowerCase();
    return searchableText.includes(normalizedDoctorSearch);
  });

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  }

  function openEdit(doctor: Doctor) {
    setEditing(doctor._id);
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    });
    setError("");
    setModal(true);
  }

  async function saveDoctor(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest(editing ? `/doctors/${editing}` : "/doctors", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setModal(false);
      await loadDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableSaveDoctor"));
    } finally {
      setLoading(false);
    }
  }

  async function deleteDoctor(id: string) {
    if (!window.confirm(t("deleteDoctorConfirm"))) return;

    try {
      await apiRequest(`/doctors/${id}`, { method: "DELETE" });
      await loadDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableDeleteDoctor"));
    }
  }

  const fields = [
    ["name", t("fullName"), "Dr. John Smith"],
    ["specialization", t("specialization"), "Cardiology"],
    ["hospital", t("hospital"), "City Medical Center"],
    ["phone", t("phone"), "+8801XXXXXXXXX"],
    ["email", t("email"), "doctor@example.com"],
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("doctors")}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("manageDoctorsIntro")}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
          >
            <Plus size={18} /> {t("addDoctorAction")}
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchDoctors")}
            className="w-full text-sm outline-none"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-800">{t("doctorDirectory")}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredDoctors.length} {t("doctorRecords")}
              </p>
            </div>
            <Stethoscope className="text-teal-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t("doctor")}</th>
                  <th className="px-5 py-4">{t("specialization")}</th>
                  <th className="px-5 py-4">{t("hospital")}</th>
                  <th className="px-5 py-4">{t("patients")}</th>
                  <th className="px-5 py-4">{t("contact")}</th>
                  <th className="px-5 py-4">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {doctor.name}
                      <p className="mt-1 text-xs font-normal text-slate-400">
                        {doctor.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{doctor.specialization}</td>
                    <td className="px-5 py-4 text-slate-600">{doctor.hospital}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-teal-50 px-3 py-1.5 font-semibold text-teal-700">
                        {doctor.patientCount ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{doctor.phone}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          aria-label={t("editDoctor")}
                          onClick={() => openEdit(doctor)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label={t("deleteDoctor")}
                          onClick={() => deleteDoctor(doctor._id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredDoctors.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      {t("noDoctorsFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editing ? t("editDoctor") : t("newDoctor")}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {t("doctorInfoPrompt")}
                </p>
              </div>
              <button onClick={() => setModal(false)} aria-label={t("close")}>
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={saveDoctor} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(([key, label, placeholder]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      {label}
                    </label>
                    <input
                      required
                      type={key === "email" ? "email" : "text"}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    />
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm"
                >
                  {t("cancel")}
                </button>
                <button
                  disabled={loading}
                  className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? t("saving") : editing ? t("saveChanges") : t("addDoctor")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

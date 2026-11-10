
"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Users } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

type Doctor = { _id: string; name: string; specialization: string };
type Patient = {
  _id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  phone: string;
  doctor?: Doctor;
  createdAt: string;
};

const emptyForm = {
  name: "",
  age: "",
  gender: "Male",
  condition: "",
  phone: "",
  doctor: "",
};

export default function PatientsPage() {
  const { t, language } = usePreferences();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search");
    if (initialSearch) setSearch(initialSearch);
  }, []);
  const [condition, setCondition] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPatients = useCallback(async () => {
    try {
      const result = await apiRequest("/patients?limit=100");
      setPatients(Array.isArray(result.data) ? result.data : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableLoadPatients"));
    }
  }, [t]);

  useEffect(() => {
    loadPatients();
    apiRequest("/doctors?limit=100")
      .then((result) => setDoctors(Array.isArray(result.data) ? result.data : []))
      .catch(() => setError(t("unableLoadDoctorList")));
  }, [loadPatients, t]);

  const normalizedPatientSearch = search.trim().toLocaleLowerCase();
  const normalizedCondition = condition.trim().toLocaleLowerCase();

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = !normalizedPatientSearch || [
      patient.name,
      patient.phone,
      patient.condition,
      patient.doctor?.name,
    ].filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedPatientSearch);

    const matchesCondition = !normalizedCondition ||
      patient.condition.toLocaleLowerCase().includes(normalizedCondition);

    return matchesSearch && matchesCondition;
  });

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  }

  function openEdit(patient: Patient) {
    setEditing(patient._id);
    setForm({
      name: patient.name,
      age: String(patient.age),
      gender: patient.gender,
      condition: patient.condition,
      phone: patient.phone,
      doctor: patient.doctor?._id || "",
    });
    setError("");
    setModal(true);
  }

  async function savePatient(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...form, age: Number(form.age) };
      await apiRequest(editing ? `/patients/${editing}` : "/patients", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setModal(false);
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableSavePatient"));
    } finally {
      setLoading(false);
    }
  }

  async function deletePatient(id: string) {
    if (!window.confirm(t("deletePatientConfirm"))) return;

    try {
      await apiRequest(`/patients/${id}`, { method: "DELETE" });
      await loadPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unableDeletePatient"));
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{t("patients")}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("managePatientsIntro")}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700"
          >
            <Plus size={18} /> {t("addPatient")}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPatients")}
              className="w-full text-sm outline-none"
            />
          </div>
          <input
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder={t("filterCondition")}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-800">{t("patientDirectory")}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredPatients.length} {t("patientRecordCount")}
              </p>
            </div>
            <Users className="text-teal-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">{t("patient")}</th>
                  <th className="px-5 py-4">{t("ageGender")}</th>
                  <th className="px-5 py-4">{t("condition")}</th>
                  <th className="px-5 py-4">{t("assignedDoctor")}</th>
                  <th className="px-5 py-4">{t("dateAdded")}</th>
                  <th className="px-5 py-4">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {patient.name}
                      <p className="mt-1 text-xs font-normal text-slate-400">
                        {patient.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {patient.age} / {patient.gender}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                        {patient.condition}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {patient.doctor?.name || t("unassigned")}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(patient.createdAt).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          aria-label={t("editPatient")}
                          onClick={() => openEdit(patient)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label={t("deletePatient")}
                          onClick={() => deletePatient(patient._id)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredPatients.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      {t("noPatients")}
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
                  {editing ? t("editPatient") : t("newPatient")}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {t("completePatient")}
                </p>
              </div>
              <button onClick={() => setModal(false)} aria-label={t("close")}>
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={savePatient} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("fullName")}
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("patientFullNamePlaceholder")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t("age")}</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder={t("agePlaceholder")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t("gender")}</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option value="Male">{t("male")}</option>
                    <option value="Female">{t("female")}</option>
                    <option value="Other">{t("other")}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t("condition")}</label>
                  <input
                    required
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    placeholder={t("conditionExample")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t("phone")}</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {t("assignedDoctor")}
                  </label>
                  <select
                    required
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <option value="">{t("selectDoctor")}</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name} — {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
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
                  {loading ? t("saving") : editing ? t("saveChanges") : t("addPatient")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

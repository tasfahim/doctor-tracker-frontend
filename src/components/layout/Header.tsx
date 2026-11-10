"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Languages,
  ChevronDown,
  X,
  Stethoscope,
  Users,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

type DoctorResult = {
  _id: string;
  name: string;
  specialization?: string;
  hospital?: string;
  email?: string;
  phone?: string;
};

type PatientResult = {
  _id: string;
  name: string;
  condition?: string;
  phone?: string;
  doctor?: { name?: string };
};

type SearchResult =
  | { type: "doctor"; id: string; title: string; detail: string; query: string }
  | { type: "patient"; id: string; title: string; detail: string; query: string };

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const { theme, toggleTheme, language, setLanguage, t } = usePreferences();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [doctors, setDoctors] = useState<DoctorResult[]>([]);
  const [patients, setPatients] = useState<PatientResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";

  useEffect(() => {
    if (!searchOpen) return;

    let cancelled = false;
    setSearchLoading(true);
    setSearchError("");

    Promise.all([
      apiRequest("/doctors?limit=100"),
      apiRequest("/patients?limit=100"),
    ])
      .then(([doctorResult, patientResult]) => {
        if (cancelled) return;
        setDoctors(Array.isArray(doctorResult.data) ? doctorResult.data : []);
        setPatients(Array.isArray(patientResult.data) ? patientResult.data : []);
      })
      .catch((error) => {
        if (!cancelled) {
          setSearchError(error instanceof Error ? error.message : t("globalSearchError"));
        }
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });

    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 40);
    return () => {
      cancelled = true;
      window.clearTimeout(focusTimer);
    };
  }, [searchOpen, t]);

  useEffect(() => {
    if (!searchOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        searchPanelRef.current &&
        event.target instanceof Node &&
        !searchPanelRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [searchOpen]);

  const results = useMemo<SearchResult[]>(() => {
    const query = searchText.trim().toLocaleLowerCase();
    if (!query) return [];

    const doctorMatches: SearchResult[] = doctors
      .filter((doctor) =>
        [doctor.name, doctor.specialization, doctor.hospital, doctor.email, doctor.phone]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      )
      .slice(0, 5)
      .map((doctor) => ({
        type: "doctor",
        id: doctor._id,
        title: doctor.name,
        detail: [doctor.specialization, doctor.hospital].filter(Boolean).join(" · "),
        query: searchText.trim(),
      }));

    const patientMatches: SearchResult[] = patients
      .filter((patient) =>
        [patient.name, patient.condition, patient.phone, patient.doctor?.name]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase()
          .includes(query)
      )
      .slice(0, 5)
      .map((patient) => ({
        type: "patient",
        id: patient._id,
        title: patient.name,
        detail: [patient.condition, patient.doctor?.name].filter(Boolean).join(" · "),
        query: searchText.trim(),
      }));

    return [...doctorMatches, ...patientMatches].slice(0, 8);
  }, [doctors, patients, searchText]);

  function openResult(result: SearchResult) {
    const path = result.type === "doctor" ? "/doctors" : "/patients";
    router.push(`${path}?search=${encodeURIComponent(result.query)}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center justify-between gap-3 border-b border-teal-800 bg-teal-700 px-5 py-3 text-white shadow-md shadow-teal-950/10 md:px-9 dark:border-teal-950 dark:bg-teal-950">
      <div>
        <p className="text-xs font-medium text-teal-100">
          Doctor Tracker / {t("workspace")}
        </p>
        <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Functional global search */}
        <div ref={searchPanelRef} className="relative">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="doctor-tracker-global-search"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Search size={16} />
            <span className="hidden sm:inline">{t("globalSearch")}</span>
          </button>

          {searchOpen && (
            <div
              id="doctor-tracker-global-search"
              className={`absolute right-0 top-[calc(100%+14px)] z-[60] w-[min(90vw,420px)] overflow-hidden rounded-2xl border shadow-2xl ${
                dark
                  ? "border-slate-700 bg-[#151f32] text-slate-100 shadow-black/40"
                  : "border-slate-200 bg-white text-slate-800 shadow-slate-900/15"
              }`}
            >
              <div className={`flex items-center gap-2 border-b px-4 py-3 ${
                dark ? "border-slate-700" : "border-slate-200"
              }`}>
                <Search size={18} className={dark ? "text-slate-400" : "text-slate-500"} />
                <input
                  ref={searchInputRef}
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder={t("globalSearchPlaceholder")}
                  className={`min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-60 ${
                    dark ? "text-white placeholder:text-slate-400" : "text-slate-800 placeholder:text-slate-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchText("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label={t("clearSearch")}
                  className={`rounded-md p-1 ${dark ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {searchLoading && (
                  <div className="flex items-center justify-center gap-2 px-3 py-8 text-sm opacity-70">
                    <Loader2 size={17} className="animate-spin" />
                    {t("searching")}
                  </div>
                )}

                {!searchLoading && searchError && (
                  <p className="px-3 py-6 text-sm text-red-500">{searchError}</p>
                )}

                {!searchLoading && !searchError && !searchText.trim() && (
                  <p className={`px-3 py-7 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {t("globalSearchHint")}
                  </p>
                )}

                {!searchLoading && !searchError && searchText.trim() && results.length === 0 && (
                  <p className={`px-3 py-7 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {t("globalSearchNoResults")}
                  </p>
                )}

                {!searchLoading && results.map((result) => {
                  const DoctorIcon = result.type === "doctor" ? Stethoscope : Users;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      type="button"
                      onClick={() => openResult(result)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                        dark ? "hover:bg-slate-800" : "hover:bg-teal-50"
                      }`}
                    >
                      <span className={`mt-0.5 rounded-lg p-2 ${
                        dark ? "bg-teal-500/15 text-teal-300" : "bg-teal-50 text-teal-700"
                      }`}>
                        <DoctorIcon size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{result.title}</span>
                        <span className={`mt-0.5 block truncate text-xs ${
                          dark ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {result.type === "doctor" ? t("doctor") : t("patient")}
                          {result.detail ? ` · ${result.detail}` : ""}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className={`border-t px-4 py-2 text-[11px] ${
                dark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"
              }`}>
                {t("globalSearchFooter")}
              </div>
            </div>
          )}
        </div>

        {/* Unified language control: icon and select share one surface */}
        <div className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-white transition hover:bg-white/15">
          <Languages size={17} className="shrink-0 text-teal-100" />
          <label htmlFor="language-selector" className="sr-only">{t("language")}</label>
          <select
            id="language-selector"
            value={language}
            onChange={(event) => setLanguage(event.target.value as "en" | "bn")}
            className="h-full cursor-pointer appearance-none border-0 !bg-transparent bg-none pr-1 text-xs font-medium text-white outline-none focus:!bg-transparent"
            style={{
              colorScheme: "dark",
              backgroundColor: "transparent",
              backgroundImage: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          >
            <option value="en" className="bg-teal-950 text-white">English</option>
            <option value="bn" className="bg-teal-950 text-white">বাংলা</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none -ml-1 text-teal-100" />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? t("switchLight") : t("switchDark")}
          title={dark ? t("switchLight") : t("switchDark")}
          className="rounded-xl border border-white/20 p-2.5 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          aria-label={t("notifications")}
          className="rounded-xl border border-white/20 p-2.5 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Bell size={18} />
        </button>

        <div
          aria-label={t("administrator")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-teal-800"
        >
          A
        </div>
      </div>
    </header>
  );
}

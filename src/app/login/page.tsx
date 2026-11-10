
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, LockKeyhole, Mail, Moon, Sun } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

export default function LoginPage() {
  const router = useRouter();
  const { t, language, setLanguage, theme, toggleTheme } = usePreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        <label htmlFor="login-language" className="sr-only">{t("language")}</label>
        <select
          id="login-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value as "en" | "bn")}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none hover:border-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t("switchLight") : t("switchDark")}
          title={theme === "dark" ? t("switchLight") : t("switchDark")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-teal-500 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <section className={`hidden w-1/2 flex-col justify-between p-14 transition-colors lg:flex ${
        theme === "dark"
          ? "bg-[#17172b] text-slate-100"
          : "bg-[#e5eaff] text-[#27336b]"
      }`}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-teal-500 p-3">
            <HeartPulse size={26} />
          </div>
          <span className="text-2xl font-bold">Doctor Tracker</span>
        </div>

        <div className="max-w-lg">
          <p className={`mb-5 text-sm font-semibold uppercase tracking-[3px] ${
            theme === "dark" ? "text-teal-300" : "text-teal-700"
          }`}>
            {t("healthcare")}
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            {t("loginHeadline")}
          </h1>
          <p className={`mt-6 text-lg leading-8 ${
            theme === "dark" ? "text-slate-300" : "text-[#52618c]"
          }`}>
            {t("loginDescription")}
          </p>
        </div>

        <p className={`text-sm ${
          theme === "dark" ? "text-slate-400" : "text-[#65739b]"
        }`}>
          {t("loginFooter")}
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center bg-slate-50 p-6 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="inline-flex rounded-xl bg-teal-600 p-3 text-white">
              <HeartPulse size={25} />
            </div>
            <h1 className="mt-3 text-xl font-bold text-slate-800 dark:text-slate-100">Doctor Tracker</h1>
          </div>

          <p className="text-sm font-semibold text-teal-700">{t("welcomeBack")}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {t("signInTitle")}
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            {t("signInDescription")}
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("loginEmailLabel")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-teal-500">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("loginPasswordLabel")}
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-teal-500">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("enterPassword")}
                  className="w-full py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            {t("secureAccess")}
          </p>
        </div>
      </section>
    </main>
  );
}

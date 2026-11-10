
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  HeartPulse,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, theme } = usePreferences();

  const links = [
    { href: "/", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/doctors", label: t("doctors"), icon: Stethoscope },
    { href: "/patients", label: t("patients"), icon: Users },
  ];

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  }

  const dark = theme === "dark";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r md:flex ${
        dark
          ? "border-[#25234f] bg-[#17172b] text-slate-100"
          : "border-indigo-200 bg-[#eef2ff] text-[#27336b]"
      }`}
    >
      <div className={`flex h-20 items-center gap-3 border-b px-6 ${
        dark ? "border-[#30304d]" : "border-indigo-200"
      }`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-sm">
          <HeartPulse size={23} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide">
            Doctor Tracker
          </h1>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-indigo-500"}`}>
            {t("healthcareManagement")}
          </p>
        </div>
      </div>

      <div className="px-5 pt-8">
        <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[2px] ${dark ? "text-slate-400" : "text-indigo-500"}`}>
          {t("workspace")}
        </p>

        <nav className="space-y-2" aria-label={t("workspace")}>
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? dark
                      ? "bg-teal-500 text-[#062b2a] shadow-md shadow-black/20"
                      : "bg-teal-700 text-white shadow-md shadow-teal-900/20"
                    : dark
                      ? "text-slate-300 hover:bg-[#292943] hover:text-white"
                      : "text-[#465487] hover:bg-indigo-100 hover:text-[#27336b]"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto border-t p-5 ${
        dark ? "border-[#30304d]" : "border-indigo-200"
      }`}>
        <div className={`mb-4 flex items-center gap-3 rounded-xl p-3 ${
          dark ? "bg-[#202039]" : "bg-white/75"
        }`}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              dark ? "bg-teal-500/15 text-teal-300" : "bg-teal-100 text-teal-800"
            }`}>
            A
          </div>

          <div>
            <p className="text-sm font-semibold">
              {t("administrator")}
            </p>
            <p className={`text-xs ${dark ? "text-slate-400" : "text-indigo-500"}`}>
              {t("systemAdmin")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 ${
            dark
              ? "text-slate-300 hover:bg-[#292943] hover:text-white"
              : "text-[#465487] hover:bg-indigo-100 hover:text-[#27336b]"
          }`}
        >
          <LogOut size={18} />
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}

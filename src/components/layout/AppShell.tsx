
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { apiRequest } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const { t } = usePreferences();

  const titles: Record<string, string> = {
    "/": t("dashboard"),
    "/doctors": t("doctorManagement"),
    "/patients": t("patientManagement"),
  };

  useEffect(() => {
    let active = true;

    apiRequest("/auth/me")
      .then(() => {
        if (active) setChecking(false);
      })
      .catch(() => {
        if (active) router.replace("/login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="app-loading flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen">
      <Sidebar />

      <div className="min-h-screen pl-0 md:pl-64">
        <Header title={titles[pathname] || "Doctor Tracker"} />
        <main className="app-main min-h-[calc(100vh-5rem)] p-5 md:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

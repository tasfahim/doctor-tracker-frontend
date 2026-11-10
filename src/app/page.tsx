
"use client";

import { useEffect, useState } from "react";
import {
  Stethoscope,
  Users,
  UserPlus,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import { usePreferences } from "@/context/PreferencesContext";

type Stats = {
  totalDoctors: number;
  totalPatients: number;
  patientsByCondition: { _id: string; count: number }[];
  patientsByDoctor: { name: string; count: number }[];
  monthlyPatients: { _id: { year: number; month: number }; count: number }[];
  recentPatients: {
    _id: string;
    name: string;
    condition: string;
    doctor?: { name: string };
    createdAt: string;
  }[];
};

const COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];

export default function Dashboard() {
  const { t, language } = usePreferences();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/dashboard/stats")
      .then((result) => setStats(result.data))
      .catch((err) => setError(err.message));
  }, []);

  const monthlyData = stats?.monthlyPatients.map((item) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleString(
      language === "bn" ? "bn-BD" : "en-US",
      { month: "short" }
    ),
    patients: item.count,
  })) || [];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{t("overview")}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-800">
              {t("welcomeAdmin")}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {t("todayPractice")}
            </p>
          </div>
          <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
            <Activity className="mr-2 inline" size={17} />
            {t("managementOverview")}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {t("dashboardLoadError")}: {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t("totalDoctors")}
            value={stats?.totalDoctors ?? "—"}
            subtitle={t("registeredSystem")}
            icon={Stethoscope}
            color="bg-teal-50 text-teal-700"
          />
          <StatCard
            title={t("totalPatients")}
            value={stats?.totalPatients ?? "—"}
            subtitle={t("patientRecords")}
            icon={Users}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            title={t("patientDoctor")}
            value={
              stats?.totalDoctors
                ? (stats.totalPatients / stats.totalDoctors).toFixed(1)
                : "0"
            }
            subtitle={t("averageAllocation")}
            icon={UserPlus}
            color="bg-violet-50 text-violet-700"
          />
          <StatCard
            title={t("systemStatus")}
            value={t("active")}
            subtitle={t("dashboardConnected")}
            icon={Activity}
            color="bg-emerald-50 text-emerald-700"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-bold text-slate-800">{t("patientRegistrations")}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {t("chartMonthlySubtitle")}
              </p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="patients"
                    fill="#0d9488"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="font-bold text-slate-800">{t("patientConditions")}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {t("chartConditionSubtitle")}
              </p>
            </div>
            <div className="flex h-72 items-center justify-center">
              {stats?.patientsByCondition.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.patientsByCondition}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {stats.patientsByCondition.map((item, index) => (
                        <Cell
                          key={item._id}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-slate-400">
                  {t("noPatientData")}
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {stats?.patientsByCondition.map((item, index) => (
                <span key={item._id} className="text-xs text-slate-500">
                  <span
                    className="mr-1 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item._id}
                </span>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="font-bold text-slate-800">{t("recentPatients")}</h2>
              <p className="mt-1 text-xs text-slate-400">
                {t("latestPatientRegistrations")}
              </p>
            </div>
            <Link
              href="/patients"
              className="flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
            >
              {t("viewAll")} <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">{t("patient")}</th>
                  <th className="px-6 py-4">{t("condition")}</th>
                  <th className="px-6 py-4">{t("doctor")}</th>
                  <th className="px-6 py-4">{t("registered")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {patient.condition}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {patient.doctor?.name || t("unassigned")}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(patient.createdAt).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US")}
                    </td>
                  </tr>
                ))}
                {!stats?.recentPatients.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      {t("noPatientRecords")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

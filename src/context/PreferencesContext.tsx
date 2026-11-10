"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "bn";
export type Theme = "light" | "dark";

type PreferencesContextType = {
  language: Language;
  theme: Theme;
  hydrated: boolean;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", overview: "Healthcare overview",
    welcome: "Welcome back, Administrator",
    dashboardIntro: "Here is what's happening in your practice today.",
    managementOverview: "Management overview",
    totalDoctors: "Total Doctors", totalPatients: "Total Patients",
    registeredSystem: "Registered in the system", patientRecords: "Patient records",
    patientDoctor: "Patient / Doctor", averageAllocation: "Average patient allocation",
    systemStatus: "System Status", active: "Active", dashboardConnected: "Dashboard connected to API",
    patientRegistrations: "Patient registrations", monthlyRecords: "Monthly patient records",
    patientConditions: "Patient conditions", conditionDistribution: "Distribution by recorded condition",
    noPatientData: "No patient data available yet", recentPatients: "Recent patients",
    latestRegistrations: "Latest patient registrations", viewAll: "View all",
    patient: "Patient", condition: "Condition", doctor: "Doctor", registered: "Registered",
    unassigned: "Unassigned", noPatientRecords: "No patient records yet. Add your first patient to get started.",
    healthcareManagement: "Healthcare Management", workspace: "Workspace",
    doctors: "Doctors", patients: "Patients", doctorManagement: "Doctor Management",
    patientManagement: "Patient Management", administrator: "Administrator",
    systemAdmin: "System Admin", signOut: "Sign out", language: "Language",
    switchDark: "Switch to dark mode", switchLight: "Switch to light mode",
    notifications: "Notifications", loading: "Loading Doctor Tracker...",
    manageDoctorsIntro: "Manage your healthcare professionals and their information.",
    managePatientsIntro: "Manage patient profiles, conditions and doctor assignments.",
    addDoctor: "Add doctor", addPatient: "Add patient", searchDoctors: "Search by doctor, specialization or hospital...",
    searchPatients: "Search patient name or phone...", filterCondition: "Filter by condition...",
    doctorDirectory: "Doctor directory", patientDirectory: "Patient directory",
    doctorRecords: "doctor records", patientRecordCount: "patient records",
    specialization: "Specialization", hospital: "Hospital", patients: "Patients",
    contact: "Contact", actions: "Actions", ageGender: "Age / Gender",
    assignedDoctor: "Assigned doctor", dateAdded: "Date added",
    editDoctor: "Edit doctor", newDoctor: "Add new doctor", editPatient: "Edit patient",
    newPatient: "Add new patient", fullName: "Full name", phone: "Phone", email: "Email",
    age: "Age", gender: "Gender", male: "Male", female: "Female", other: "Other",
    completePatient: "Complete the patient profile.", enterDoctor: "Enter the doctor's information below.",
    patientFullName: "Patient full name", selectDoctor: "Select a doctor",
    cancel: "Cancel", saving: "Saving...", saveChanges: "Save changes",
    close: "Close", edit: "Edit", delete: "Delete",
    noDoctors: "No doctors found. Add your first doctor to get started.",
    noPatients: "No patients found. Add your first patient to get started.",
    deletePatientConfirm: "Are you sure you want to delete this patient?",
    deleteDoctorConfirm: "Delete this doctor and all associated patients?",
    unableLoadDoctors: "Unable to load doctors", unableSaveDoctor: "Unable to save doctor",
    unableDeleteDoctor: "Unable to delete doctor", unableLoadPatients: "Unable to load patients",
    unableLoadDoctorList: "Unable to load doctor list", unableSavePatient: "Unable to save patient",
    unableDeletePatient: "Unable to delete patient", loginFailed: "Login failed",
    healthcare: "Healthcare management", loginHeadline: "Better care begins with better organization.",
    loginDescription: "A centralized workspace to manage doctors, patient records and healthcare operations with clarity.",
    welcomeBack: "WELCOME BACK", signInTitle: "Sign in to your account",
    signInDescription: "Enter your administrator credentials to continue.",
    emailAddress: "Email address", password: "Password", enterPassword: "Enter your password",
    signingIn: "Signing in...", signIn: "Sign in",
    secureAccess: "Secure administrator access · Doctor Tracker",
    languageEnglish: "English", languageBangla: "বাংলা",
    dashboardLoadError: "Could not load dashboard",
    patientFullNamePlaceholder: "Patient full name", agePlaceholder: "Age",
    conditionExample: "e.g. Diabetes",
    chartMonthlySubtitle: "Monthly patient records",
    chartConditionSubtitle: "Distribution by recorded condition",
    latestPatientRegistrations: "Latest patient registrations",
    welcomeAdmin: "Welcome back, Administrator",
    todayPractice: "Here is what's happening in your practice today.",
    addDoctorAction: "Add doctor",
    doctorInfoPrompt: "Enter the doctor's information below.",
    noDoctorsFound: "No doctors found. Add your first doctor to get started.",
    loginEmailLabel: "Email address",
    loginPasswordLabel: "Password",
    loginFooter: "Doctor Tracker · Healthcare Management Platform",
    searchBrand: "Doctor Tracker",
    recordsUnit: "records",
    month: "Month",
    count: "Count",
    doctorDelete: "Delete doctor",
    patientDelete: "Delete patient",
    doctorEdit: "Edit doctor",
    patientEdit: "Edit patient",
    globalSearch: "Search",
    globalSearchPlaceholder: "Search doctors and patients...",
    globalSearchHint: "Search by name, phone, condition, specialization or hospital.",
    globalSearchNoResults: "No matching doctors or patients found.",
    globalSearchError: "Unable to load search results.",
    globalSearchFooter: "Select a result to open its management page.",
    searching: "Searching...",
    clearSearch: "Clear search",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড", overview: "স্বাস্থ্যসেবার সংক্ষিপ্ত বিবরণ",
    welcome: "স্বাগতম, অ্যাডমিনিস্ট্রেটর",
    dashboardIntro: "আজ আপনার প্রতিষ্ঠানের কার্যক্রমের সংক্ষিপ্ত চিত্র।",
    managementOverview: "ব্যবস্থাপনার সারসংক্ষেপ",
    totalDoctors: "মোট ডাক্তার", totalPatients: "মোট রোগী",
    registeredSystem: "সিস্টেমে নিবন্ধিত", patientRecords: "রোগীর রেকর্ড",
    patientDoctor: "রোগী / ডাক্তার", averageAllocation: "গড় রোগী বণ্টন",
    systemStatus: "সিস্টেমের অবস্থা", active: "সক্রিয়", dashboardConnected: "ড্যাশবোর্ড API-এর সঙ্গে সংযুক্ত",
    patientRegistrations: "রোগী নিবন্ধন", monthlyRecords: "মাসভিত্তিক রোগীর রেকর্ড",
    patientConditions: "রোগীর শারীরিক অবস্থা", conditionDistribution: "নথিভুক্ত অবস্থা অনুযায়ী বণ্টন",
    noPatientData: "এখনো কোনো রোগীর তথ্য নেই", recentPatients: "সাম্প্রতিক রোগীরা",
    latestRegistrations: "সর্বশেষ রোগী নিবন্ধন", viewAll: "সব দেখুন",
    patient: "রোগী", condition: "রোগের অবস্থা", doctor: "ডাক্তার", registered: "নিবন্ধনের তারিখ",
    unassigned: "নির্ধারিত নয়", noPatientRecords: "এখনো কোনো রোগীর রেকর্ড নেই। শুরু করতে প্রথম রোগী যোগ করুন।",
    healthcareManagement: "স্বাস্থ্যসেবা ব্যবস্থাপনা", workspace: "কর্মক্ষেত্র",
    doctors: "ডাক্তার", patients: "রোগী", doctorManagement: "ডাক্তার ব্যবস্থাপনা",
    patientManagement: "রোগী ব্যবস্থাপনা", administrator: "প্রশাসক",
    systemAdmin: "সিস্টেম প্রশাসক", signOut: "লগ আউট", language: "ভাষা",
    switchDark: "ডার্ক মোড চালু করুন", switchLight: "লাইট মোড চালু করুন",
    notifications: "বিজ্ঞপ্তি", loading: "Doctor Tracker লোড হচ্ছে...",
    manageDoctorsIntro: "চিকিৎসক এবং তাঁদের তথ্য পরিচালনা করুন।",
    managePatientsIntro: "রোগীর প্রোফাইল, রোগের অবস্থা এবং ডাক্তার বরাদ্দ পরিচালনা করুন।",
    addDoctor: "ডাক্তার যোগ করুন", addPatient: "রোগী যোগ করুন",
    searchDoctors: "ডাক্তার, বিশেষজ্ঞতা বা হাসপাতাল দিয়ে খুঁজুন...",
    searchPatients: "রোগীর নাম বা ফোন নম্বর দিয়ে খুঁজুন...", filterCondition: "রোগের অবস্থা দিয়ে ফিল্টার করুন...",
    doctorDirectory: "ডাক্তার তালিকা", patientDirectory: "রোগীর তালিকা",
    doctorRecords: "জন ডাক্তার", patientRecordCount: "টি রোগীর রেকর্ড",
    specialization: "বিশেষজ্ঞতা", hospital: "হাসপাতাল", patients: "রোগী",
    contact: "যোগাযোগ", actions: "কার্যক্রম", ageGender: "বয়স / লিঙ্গ",
    assignedDoctor: "নির্ধারিত ডাক্তার", dateAdded: "যোগ করার তারিখ",
    editDoctor: "ডাক্তার সম্পাদনা", newDoctor: "নতুন ডাক্তার যোগ করুন",
    editPatient: "রোগী সম্পাদনা", newPatient: "নতুন রোগী যোগ করুন",
    fullName: "পূর্ণ নাম", phone: "ফোন", email: "ইমেইল", age: "বয়স",
    gender: "লিঙ্গ", male: "পুরুষ", female: "নারী", other: "অন্যান্য",
    completePatient: "রোগীর প্রোফাইলের তথ্য পূরণ করুন।",
    enterDoctor: "নিচে ডাক্তারের তথ্য লিখুন।", patientFullName: "রোগীর পূর্ণ নাম",
    selectDoctor: "একজন ডাক্তার নির্বাচন করুন", cancel: "বাতিল",
    saving: "সংরক্ষণ হচ্ছে...", saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    close: "বন্ধ করুন", edit: "সম্পাদনা", delete: "মুছুন",
    noDoctors: "কোনো ডাক্তার পাওয়া যায়নি। শুরু করতে প্রথম ডাক্তার যোগ করুন।",
    noPatients: "কোনো রোগী পাওয়া যায়নি। শুরু করতে প্রথম রোগী যোগ করুন।",
    deletePatientConfirm: "আপনি কি নিশ্চিত যে এই রোগীকে মুছে ফেলতে চান?",
    deleteDoctorConfirm: "এই ডাক্তার এবং তাঁর সঙ্গে যুক্ত সব রোগী মুছে ফেলতে চান?",
    unableLoadDoctors: "ডাক্তারের তথ্য লোড করা যায়নি",
    unableSaveDoctor: "ডাক্তারের তথ্য সংরক্ষণ করা যায়নি",
    unableDeleteDoctor: "ডাক্তার মুছে ফেলা যায়নি",
    unableLoadPatients: "রোগীর তথ্য লোড করা যায়নি",
    unableLoadDoctorList: "ডাক্তারের তালিকা লোড করা যায়নি",
    unableSavePatient: "রোগীর তথ্য সংরক্ষণ করা যায়নি",
    unableDeletePatient: "রোগী মুছে ফেলা যায়নি", loginFailed: "লগইন ব্যর্থ হয়েছে",
    healthcare: "স্বাস্থ্যসেবা ব্যবস্থাপনা",
    loginHeadline: "আরও ভালো সেবার শুরু সুশৃঙ্খল ব্যবস্থাপনা থেকে।",
    loginDescription: "ডাক্তার, রোগীর রেকর্ড এবং স্বাস্থ্যসেবা কার্যক্রম পরিচালনার জন্য একটি কেন্দ্রীয় প্ল্যাটফর্ম।",
    welcomeBack: "আবার স্বাগতম", signInTitle: "আপনার অ্যাকাউন্টে প্রবেশ করুন",
    signInDescription: "চালিয়ে যেতে প্রশাসকের লগইন তথ্য লিখুন।",
    emailAddress: "ইমেইল ঠিকানা", password: "পাসওয়ার্ড",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন", signingIn: "প্রবেশ করা হচ্ছে...",
    signIn: "প্রবেশ করুন", secureAccess: "নিরাপদ প্রশাসক প্রবেশাধিকার · Doctor Tracker",
    languageEnglish: "English", languageBangla: "বাংলা",
    dashboardLoadError: "ড্যাশবোর্ড লোড করা যায়নি",
    patientFullNamePlaceholder: "রোগীর পূর্ণ নাম", agePlaceholder: "বয়স",
    conditionExample: "যেমন: ডায়াবেটিস",
    chartMonthlySubtitle: "মাসভিত্তিক রোগীর রেকর্ড",
    chartConditionSubtitle: "নথিভুক্ত রোগের অবস্থা অনুযায়ী বণ্টন",
    latestPatientRegistrations: "সর্বশেষ রোগী নিবন্ধন",
    welcomeAdmin: "স্বাগতম, অ্যাডমিনিস্ট্রেটর",
    todayPractice: "আজ আপনার প্রতিষ্ঠানের কার্যক্রমের সংক্ষিপ্ত চিত্র।",
    addDoctorAction: "ডাক্তার যোগ করুন",
    doctorInfoPrompt: "নিচে ডাক্তারের তথ্য লিখুন।",
    noDoctorsFound: "কোনো ডাক্তার পাওয়া যায়নি। শুরু করতে প্রথম ডাক্তার যোগ করুন।",
    loginEmailLabel: "ইমেইল ঠিকানা",
    loginPasswordLabel: "পাসওয়ার্ড",
    loginFooter: "Doctor Tracker · স্বাস্থ্যসেবা ব্যবস্থাপনা প্ল্যাটফর্ম",
    searchBrand: "Doctor Tracker",
    recordsUnit: "টি রেকর্ড",
    month: "মাস",
    count: "সংখ্যা",
    doctorDelete: "ডাক্তার মুছুন",
    patientDelete: "রোগী মুছুন",
    doctorEdit: "ডাক্তার সম্পাদনা করুন",
    patientEdit: "রোগী সম্পাদনা করুন",
    globalSearch: "খুঁজুন",
    globalSearchPlaceholder: "ডাক্তার ও রোগী খুঁজুন...",
    globalSearchHint: "নাম, ফোন, রোগের অবস্থা, বিশেষজ্ঞতা বা হাসপাতাল দিয়ে খুঁজুন।",
    globalSearchNoResults: "কোনো মিলযুক্ত ডাক্তার বা রোগী পাওয়া যায়নি।",
    globalSearchError: "অনুসন্ধানের তথ্য লোড করা যায়নি।",
    globalSearchFooter: "ফলাফলে ক্লিক করলে সংশ্লিষ্ট ব্যবস্থাপনা পৃষ্ঠা খুলবে।",
    searching: "খোঁজা হচ্ছে...",
    clearSearch: "অনুসন্ধান মুছুন",
  },
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);
const LANGUAGE_KEY = "doctor-tracker-language";
const THEME_KEY = "doctor-tracker-theme";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedLanguage === "en" || savedLanguage === "bn") setLanguageState(savedLanguage);
      if (savedTheme === "light" || savedTheme === "dark") setThemeState(savedTheme);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = language;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Preferences still work for the current session if storage is unavailable.
    }
  }, [language, theme, hydrated]);

  const setLanguage = useCallback((next: Language) => setLanguageState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((current) => current === "light" ? "dark" : "light"),
    []
  );
  const t = useCallback(
    (key: string) => translations[language][key] ?? translations.en[key] ?? key,
    [language]
  );

  return (
    <PreferencesContext.Provider value={{ language, theme, hydrated, setLanguage, toggleTheme, t }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used inside PreferencesProvider");
  return context;
}

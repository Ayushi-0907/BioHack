import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  UploadCloud,
  AlertTriangle,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Activity,
  Calendar,
  Check,
  Slash,
  Eye,
  ArrowRight,
  Sparkles,
  Heart,
  FileUp,
  Stethoscope,
  BookOpen,
  BellRing,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const initialMedicalProfile = {
  fullName: "Eleanor Vance",
  dob: "1968-04-12",
  gender: "Female",
  primaryPhysician: "Dr. Sarah Jenkins, MD (Cardiology)",
  emergencyContact: "David Vance (Son) - (555) 382-9102",
  chronicConditions: ["Diabetes Type 2", "Hypertension"],
  allergies: ["Penicillin", "Sulfa Drugs"],
  bloodType: "A+"
};

const initialDocuments = [
  {
    id: "doc-101",
    name: "St_Jude_Discharge_Summary_Oct2026.pdf",
    type: "PDF",
    uploadDate: "2026-10-24",
    facility: "St. Jude Medical Center",
    physician: "Dr. A. Vance",
    status: "Processed",
    extractCount: 4,
    hasConflicts: true,
    fileSize: "2.4 MB",
    contentSnippet: "Discharge instructions: Patient to resume Lisinopril 10mg daily. Aspirin 81mg daily. Follow-up HbA1c test in 3 months. Note: Take pain medication as directed."
  },
  {
    id: "doc-102",
    name: "Endocrinology_Rx_Nov2026.jpg",
    type: "JPEG",
    uploadDate: "2026-10-28",
    facility: "Metabolic Health Clinic",
    physician: "Dr. R. Patel",
    status: "Processed",
    extractCount: 2,
    hasConflicts: false,
    fileSize: "1.1 MB",
    contentSnippet: "Metformin ER 500mg PO BID with meals. Monitor blood glucose twice daily. Comprehensive Metabolic Panel (CMP) due in 60 days."
  },
  {
    id: "doc-103",
    name: "Cardiology_Consult_Aspirin_Note.pdf",
    type: "PDF",
    uploadDate: "2026-10-30",
    facility: "Metro Heart Institute",
    physician: "Dr. S. Jenkins",
    status: "Processed",
    extractCount: 2,
    hasConflicts: true,
    fileSize: "1.8 MB",
    contentSnippet: "Increase Aspirin to 325mg daily for post-PCI prophylaxis. Discontinue prior low dose unless stomach upset occurs."
  }
];

const initialTimelineItems = [
  {
    id: "ev-1",
    docId: "doc-101",
    docName: "St_Jude_Discharge_Summary_Oct2026.pdf",
    page: 2,
    type: "Medication",
    title: "Lisinopril 10mg",
    dose: "10 mg",
    frequency: "Once daily (Morning)",
    duration: "Ongoing (365 days)",
    sourceSnippet: "...Patient to resume Lisinopril 10mg daily morning dose for BP control...",
    verified: true,
    category: "Hypertension"
  },
  {
    id: "ev-2",
    docId: "doc-102",
    docName: "Endocrinology_Rx_Nov2026.jpg",
    page: 1,
    type: "Medication",
    title: "Metformin ER 500mg",
    dose: "500 mg Extended Release",
    frequency: "Twice daily with meals (8:00 AM, 6:00 PM)",
    duration: "Ongoing",
    sourceSnippet: "...Metformin ER 500mg PO BID with morning and evening meals...",
    verified: true,
    category: "Diabetes"
  },
  {
    id: "ev-3",
    docId: "doc-101",
    docName: "St_Jude_Discharge_Summary_Oct2026.pdf",
    page: 3,
    type: "Lab Test",
    title: "HbA1c Blood Test",
    dose: "Lab Order",
    frequency: "Every 90 days",
    duration: "Due Nov 15, 2026",
    sourceSnippet: "...Follow-up HbA1c lab test in 3 months to assess glycemic control...",
    verified: true,
    category: "Diabetes"
  },
  {
    id: "ev-4",
    docId: "doc-101",
    docName: "St_Jude_Discharge_Summary_Oct2026.pdf",
    page: 4,
    type: "Medication",
    title: "Analgesic Pain Relief",
    dose: "Unspecified",
    frequency: "As directed",
    duration: "As needed",
    sourceSnippet: "...Note: Take pain medication as directed by attending physical therapist...",
    verified: false,
    category: "General"
  }
];

const initialConflicts = [
  {
    id: "conf-1",
    severity: "High",
    title: "Dosage Conflict: Aspirin Strength",
    description: "Doc #1 (St. Jude) specifies Aspirin 81mg Daily, while Doc #3 (Metro Heart) specifies Aspirin 325mg Daily.",
    docsInvolved: ["St_Jude_Discharge_Summary_Oct2026.pdf", "Cardiology_Consult_Aspirin_Note.pdf"],
    options: ["Accept 325mg Daily (Latest Cardiology Note)", "Maintain 81mg Daily", "Contact Physician for Clarification"],
    status: "Pending User Approval"
  },
  {
    id: "conf-2",
    severity: "Medium",
    title: "Ambiguous Timing Instruction",
    description: "Doc #1 extracted item 'Analgesic Pain Relief' specifies 'Take as directed' without precise dosage or maximum daily limit.",
    docsInvolved: ["St_Jude_Discharge_Summary_Oct2026.pdf"],
    options: ["Specify 500mg Acetaminophen PRN Max 2x/day", "Deactivate Reminder", "Mark for Physician Review"],
    status: "Pending User Approval"
  }
];

const initialReminders = [
  {
    id: "rem-1",
    title: "Lisinopril 10mg",
    time: "08:00 AM",
    type: "Medication",
    instructions: "Take 1 pill with glass of water",
    status: "Taken",
    actionTime: "08:05 AM Today",
    category: "Hypertension"
  },
  {
    id: "rem-2",
    title: "Metformin ER 500mg",
    time: "08:30 AM",
    type: "Medication",
    instructions: "Take 1 tablet after breakfast",
    status: "Taken",
    actionTime: "08:40 AM Today",
    category: "Diabetes"
  },
  {
    id: "rem-3",
    title: "Blood Glucose Check",
    time: "01:00 PM",
    type: "Smart Test",
    instructions: "Pre-lunch fingerprick glucose log",
    status: "Pending",
    actionTime: null,
    category: "Diabetes"
  },
  {
    id: "rem-4",
    title: "Metformin ER 500mg",
    time: "06:30 PM",
    type: "Medication",
    instructions: "Take 1 tablet after dinner",
    status: "Pending",
    actionTime: null,
    category: "Diabetes"
  },
  {
    id: "rem-5",
    title: "Evening Blood Pressure Check",
    time: "08:00 PM",
    type: "Smart Test",
    instructions: "Rest 5 mins before cuff reading",
    status: "Pending",
    actionTime: null,
    category: "Hypertension"
  }
];

const initialAdherenceLogs = [
  { date: "2026-11-01", item: "Lisinopril 10mg", status: "Taken", timeLogged: "08:05 AM" },
  { date: "2026-11-01", item: "Metformin ER 500mg", status: "Taken", timeLogged: "08:40 AM" },
  { date: "2026-10-31", item: "Lisinopril 10mg", status: "Taken", timeLogged: "08:10 AM" },
  { date: "2026-10-31", item: "Metformin ER 500mg", status: "Taken", timeLogged: "08:30 AM" },
  { date: "2026-10-31", item: "Metformin ER 500mg (Evening)", status: "Skipped", timeLogged: "07:15 PM" },
  { date: "2026-10-30", item: "Lisinopril 10mg", status: "Taken", timeLogged: "08:00 AM" },
  { date: "2026-10-30", item: "HbA1c Lab Appointment", status: "Taken", timeLogged: "10:30 AM" }
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // App Core States
  const [profile, setProfile] = useState(initialMedicalProfile);
  const [documents, setDocuments] = useState(initialDocuments);
  const [timeline, setTimeline] = useState(initialTimelineItems);
  const [conflicts, setConflicts] = useState(initialConflicts);
  const [reminders, setReminders] = useState(initialReminders);
  const [adherenceLogs, setAdherenceLogs] = useState(initialAdherenceLogs);

  // Dynamic Upload Simulation State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocForModal, setSelectedDocForModal] = useState(null);

  // Toast / Banner state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Smart Test Recommendations based on Profile Chronic Conditions
  const smartRecommendations = useMemo(() => {
    const recs = [];
    if (profile.chronicConditions.includes("Diabetes Type 2")) {
      recs.push({
        id: "smart-1",
        title: "HbA1c Blood Test Prompt",
        frequency: "Every 3 Months",
        reason: "Active Diabetes Type 2 condition detected",
        status: "Due in 14 days",
        actionText: "Schedule at Quest Diagnostics"
      });
      recs.push({
        id: "smart-2",
        title: "Annual Diabetic Eye Screening",
        frequency: "Annually",
        reason: "Diabetic retinopathy prevention protocol",
        status: "Recommended",
        actionText: "Book Optometry Check"
      });
    }
    if (profile.chronicConditions.includes("Hypertension")) {
      recs.push({
        id: "smart-3",
        title: "Weekly Blood Pressure Trend Log",
        frequency: "2x per week",
        reason: "Hypertension monitoring guideline",
        status: "Active Tracking",
        actionText: "Log Morning BP Reading"
      });
    }
    return recs;
  }, [profile.chronicConditions]);

  // Compute adherence score
  const adherenceRate = useMemo(() => {
    const takenCount = reminders.filter(r => r.status === 'Taken').length;
    const totalProcessed = reminders.filter(r => r.status !== 'Pending').length;
    if (totalProcessed === 0) return 100;
    return Math.round((takenCount / totalProcessed) * 100);
  }, [reminders]);

  // Handle Reminder Actions
  const handleReminderStatus = (id, newStatus) => {
    setReminders(prev =>
      prev.map(item => {
        if (item.id === id) {
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return { ...item, status: newStatus, actionTime: `${now} Today` };
        }
        return item;
      })
    );

    const target = reminders.find(r => r.id === id);
    if (target) {
      setAdherenceLogs(prev => [
        {
          date: new Date().toISOString().split('T')[0],
          item: target.title,
          status: newStatus,
          timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }
    showToast(`Marked "${target?.title}" as ${newStatus}`);
  };

  // Handle Resolving Conflict
  const handleResolveConflict = (conflictId, chosenOption) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    
    // Add confirmed medication to schedule automatically
    const newReminder = {
      id: `rem-conf-${Date.now()}`,
      title: chosenOption.includes("325mg") ? "Aspirin 325mg (Confirmed)" : "Aspirin (Customized)",
      time: "09:00 AM",
      type: "Medication",
      instructions: chosenOption,
      status: "Pending",
      actionTime: null,
      category: "Cardiovascular"
    };
    setReminders(prev => [...prev, newReminder]);
    showToast(`Conflict resolved! Activated into schedule: ${chosenOption}`);
  };

  // Simulate AI Document Processing
  const handleSimulatedUpload = (docTitle, docType) => {
    setUploading(true);
    setUploadProgress(15);
    
    const interval = setInterval(() => {
      setUploadProgress(old => {
        if (old >= 95) {
          clearInterval(interval);
          return 95;
        }
        return old + 20;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setUploading(false);
      setUploadProgress(100);

      const newId = `doc-${Date.now()}`;
      const newDoc = {
        id: newId,
        name: docTitle || `Scanned_Prescription_${new Date().toLocaleDateString().replace(/\//g,'-')}.pdf`,
        type: docType || "PDF",
        uploadDate: new Date().toISOString().split('T')[0],
        facility: "City Primary Care Center",
        physician: "Dr. E. Thorne",
        status: "Processed",
        extractCount: 2,
        hasConflicts: false,
        fileSize: "1.6 MB",
        contentSnippet: "Rx: Rosuvastatin 10mg daily at bedtime for lipid control. Routine Lipid Panel test in 90 days."
      };

      setDocuments(prev => [newDoc, ...prev]);

      // Add parsed evidence to timeline
      const newTimelineItem = {
        id: `ev-${Date.now()}`,
        docId: newId,
        docName: newDoc.name,
        page: 1,
        type: "Medication",
        title: "Rosuvastatin 10mg",
        dose: "10 mg",
        frequency: "Once daily (Bedtime)",
        duration: "90 days",
        sourceSnippet: "...Rosuvastatin 10mg daily at bedtime for lipid control...",
        verified: false,
        category: "Cardiovascular"
      };

      setTimeline(prev => [newTimelineItem, ...prev]);
      showToast("Document successfully analyzed! 2 items extracted & added to Timeline.");
    }, 2400);
  };

  // Verify timeline item
  const handleVerifyTimelineItem = (id) => {
    setTimeline(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, verified: true };
        }
        return item;
      })
    );
    showToast("Item human-verified! Ready for auto-scheduling.");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* --- TOP APP BAR --- */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-500/20">
                <Activity size={22} className="animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  CareTrail <span className="text-teal-600 dark:text-teal-400 font-extrabold">ActionLoop</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase -mt-1 hidden sm:block">
                  AI Doc Parser & Actionable Care Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {conflicts.length > 0 && (
              <button
                onClick={() => setActiveTab('conflicts')}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse"
              >
                <AlertTriangle size={14} />
                <span>{conflicts.length} Unresolved Flag{conflicts.length > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </button>

            {/* Quick Profile Badge */}
            <div 
              onClick={() => setActiveTab('onboarding')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition"
            >
              <div className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                {profile.fullName.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden md:inline">
                {profile.fullName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --- TOAST NOTIFICATION BANNER --- */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-teal-800 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-teal-600 animate-bounce">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- MAIN LAYOUT CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">

        {/* --- DESKTOP SIDEBAR --- */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out bg-white dark:bg-slate-900 lg:bg-transparent border-r lg:border-none border-slate-200 dark:border-slate-800 p-4 lg:p-0 flex flex-col justify-between shrink-0`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            
            <NavButton
              icon={<Activity size={18} />}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              badge={reminders.filter(r => r.status === 'Pending').length}
            />

            <NavButton
              icon={<UploadCloud size={18} />}
              label="Document Hub"
              active={activeTab === 'upload'}
              onClick={() => { setActiveTab('upload'); setSidebarOpen(false); }}
            />

            <NavButton
              icon={<BookOpen size={18} />}
              label="Evidence Timeline"
              active={activeTab === 'timeline'}
              onClick={() => { setActiveTab('timeline'); setSidebarOpen(false); }}
              badge={timeline.filter(t => !t.verified).length ? `${timeline.filter(t => !t.verified).length} Unverified` : null}
            />

            <NavButton
              icon={<ShieldAlert size={18} />}
              label="Conflict Flags"
              active={activeTab === 'conflicts'}
              onClick={() => { setActiveTab('conflicts'); setSidebarOpen(false); }}
              badge={conflicts.length}
              badgeColor="bg-amber-500 text-white"
            />

            <NavButton
              icon={<Clock size={18} />}
              label="Reminder Engine"
              active={activeTab === 'reminders'}
              onClick={() => { setActiveTab('reminders'); setSidebarOpen(false); }}
            />

            <div className="pt-4 px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Patient Profile
            </div>

            <NavButton
              icon={<User size={18} />}
              label="Intake & Conditions"
              active={activeTab === 'onboarding'}
              onClick={() => { setActiveTab('onboarding'); setSidebarOpen(false); }}
            />
          </div>

          {/* Sidebar Footer Context Widget */}
          <div className="mt-8 p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold text-xs mb-1">
              <Stethoscope size={16} />
              <span>Smart Health Guard</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {profile.chronicConditions.length} chronic conditions linked. Safety verification active for all incoming prescriptions.
            </p>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">

          {/* VIEW 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-700 to-slate-800 text-white p-6 rounded-3xl shadow-lg">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Welcome back, {profile.fullName}</h1>
                  <p className="text-teal-100 text-sm mt-1">
                    Your ActionLoop safety net is active. {conflicts.length > 0 ? `You have ${conflicts.length} pending medication ambiguity flag(s) to review.` : "All prescription schedules are verified and safe."}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center justify-center gap-2 bg-white text-teal-800 hover:bg-teal-50 px-4 py-2.5 rounded-xl font-semibold text-sm shadow transition shrink-0"
                >
                  <FileUp size={18} />
                  Upload New Document
                </button>
              </div>

              {/* Metrics Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Daily Adherence"
                  value={`${adherenceRate}%`}
                  subtext="Based on today's logs"
                  icon={<Award className="text-teal-500" size={22} />}
                  darkMode={darkMode}
                />
                <MetricCard
                  title="Pending Actions"
                  value={reminders.filter(r => r.status === 'Pending').length}
                  subtext="Medications/Tests due"
                  icon={<Clock className="text-amber-500" size={22} />}
                  darkMode={darkMode}
                />
                <MetricCard
                  title="Active Documents"
                  value={documents.length}
                  subtext="Parsed into trail"
                  icon={<FileText className="text-blue-500" size={22} />}
                  darkMode={darkMode}
                />
                <MetricCard
                  title="Unresolved Flags"
                  value={conflicts.length}
                  subtext={conflicts.length > 0 ? "Action Required" : "All Clear"}
                  icon={<ShieldAlert className={conflicts.length > 0 ? "text-red-500" : "text-emerald-500"} size={22} />}
                  darkMode={darkMode}
                />
              </div>

              {/* Contextual Smart Test Reminders Banner */}
              {smartRecommendations.length > 0 && (
                <div className={`p-5 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-teal-900/50' : 'bg-teal-50/60 border-teal-200'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-teal-600 dark:text-teal-400" />
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Contextual Health Engine Prompts ({profile.chronicConditions.join(", ")})
                      </h3>
                    </div>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">Auto-Triggered</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {smartRecommendations.map(rec => (
                      <div key={rec.id} className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        darkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white border-teal-100'
                      }`}>
                        <div className="space-y-1">
                          <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{rec.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{rec.reason} • <span className="font-medium text-teal-600 dark:text-teal-400">{rec.frequency}</span></p>
                        </div>
                        <button 
                          onClick={() => showToast(`Initiated: ${rec.actionText}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shrink-0"
                        >
                          {rec.actionText}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Today's Schedule & Actionable Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Reminders Quick Action Log */}
                <div className={`lg:col-span-2 p-5 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Clock size={18} className="text-teal-600" />
                      Today's ActionLoop Schedule
                    </h3>
                    <button 
                      onClick={() => setActiveTab('reminders')}
                      className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
                    >
                      View Full Log <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reminders.map(item => (
                      <div key={item.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        item.status === 'Taken'
                          ? darkMode ? 'bg-slate-950/40 border-emerald-900/40 opacity-80' : 'bg-emerald-50/40 border-emerald-200'
                          : item.status === 'Skipped'
                          ? darkMode ? 'bg-slate-950/40 border-slate-800 opacity-60' : 'bg-slate-100 border-slate-200'
                          : darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-2 rounded-lg ${
                            item.status === 'Taken' 
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' 
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-600'
                          }`}>
                            <BellRing size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.instructions}</p>
                            {item.actionTime && (
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                Logged: {item.actionTime}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {item.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleReminderStatus(item.id, 'Taken')}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-sm"
                              >
                                <Check size={14} /> Taken
                              </button>
                              <button
                                onClick={() => handleReminderStatus(item.id, 'Skipped')}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
                              >
                                Skip
                              </button>
                            </>
                          ) : (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                              item.status === 'Taken' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-slate-500/10 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Documents Quick Widget */}
                <div className={`p-5 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <FileText size={18} className="text-teal-600" />
                      Recent Documents
                    </h3>
                    <button 
                      onClick={() => setActiveTab('upload')}
                      className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Hub
                    </button>
                  </div>

                  <div className="space-y-3">
                    {documents.slice(0, 3).map(doc => (
                      <div key={doc.id} className={`p-3 rounded-xl border transition ${
                        darkMode ? 'bg-slate-800/40 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">{doc.name}</p>
                            <p className="text-[10px] text-slate-500">{doc.facility} • {doc.uploadDate}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            doc.hasConflicts 
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}>
                            {doc.hasConflicts ? 'Flagged' : 'Verified'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1"
                    >
                      Browse Extracted Timeline <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* VIEW 2: ONBOARDING & MEDICAL PROFILE INTAKE */}
          {activeTab === 'onboarding' && (
            <div className="space-y-6 max-w-4xl">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={22} className="text-teal-600" />
                  Medical History & Intake Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  CareTrail ActionLoop uses your medical history to cross-verify extracted medication dosages and automatically trigger lab test reminders.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              } space-y-6`}>
                
                {/* Personal Bio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Patient Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className={`w-full text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Physician</label>
                    <input
                      type="text"
                      value={profile.primaryPhysician}
                      onChange={(e) => setProfile({ ...profile, primaryPhysician: e.target.value })}
                      className={`w-full text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Chronic Conditions Tag Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Chronic Diagnoses & Active Conditions
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.chronicConditions.map((cond, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                        {cond}
                        <button
                          onClick={() => {
                            const updated = profile.chronicConditions.filter((_, i) => i !== idx);
                            setProfile({ ...profile, chronicConditions: updated });
                          }}
                          className="hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newConditionInput"
                      placeholder="Add condition (e.g. Asthma, Hyperlipidemia)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          setProfile({ ...profile, chronicConditions: [...profile.chronicConditions, e.target.value.trim()] });
                          e.target.value = '';
                        }
                      }}
                      className={`flex-1 text-sm px-3.5 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                      }`}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('newConditionInput');
                        if (input && input.value.trim()) {
                          setProfile({ ...profile, chronicConditions: [...profile.chronicConditions, input.value.trim()] });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Known Allergies & Drug Sensitivities
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.allergies.map((allergy, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        <AlertTriangle size={12} />
                        {allergy}
                        <button
                          onClick={() => {
                            const updated = profile.allergies.filter((_, i) => i !== idx);
                            setProfile({ ...profile, allergies: updated });
                          }}
                          className="hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => showToast("Medical Profile Updated & Safety Engine Recalibrated!")}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <Check size={16} /> Save Intake Profile
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 3: DOCUMENT UPLOAD & AI EXTRACTION HUB */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud size={22} className="text-teal-600" />
                  Document Upload & AI Extraction Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload medical PDFs or clinical images. Our ActionLoop engine extracts dosage, frequency, lab requirements, and generates structured JSON data.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className={`p-8 rounded-3xl border-2 border-dashed text-center transition ${
                darkMode ? 'bg-slate-900/60 border-slate-700 hover:border-teal-500' : 'bg-slate-50 border-slate-300 hover:border-teal-500'
              }`}>
                <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 mx-auto flex items-center justify-center mb-4">
                  <FileUp size={28} />
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Drag & Drop Discharge Summaries or Clinic Records
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Supports PDF, PNG, JPEG formats up to 15MB per file. Automatically parses unstructured doctor notes.
                </p>

                {/* Simulated Quick Action Upload Buttons */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => handleSimulatedUpload("Endocrine_Lab_Order_Nov2026.pdf", "PDF")}
                    disabled={uploading}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Plus size={16} /> Simulate Lab PDF Upload
                  </button>

                  <button
                    onClick={() => handleSimulatedUpload("Pharmacy_Prescription_Scan.jpg", "JPEG")}
                    disabled={uploading}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud size={16} /> Simulate Rx Image Scan
                  </button>
                </div>

                {/* Simulated AI Scan Progress Bar */}
                {uploading && (
                  <div className="mt-6 max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                      <span className="flex items-center gap-1.5"><Sparkles size={14} className="animate-spin" /> AI Extraction in progress...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 transition-all duration-300 ease-out" 
                        style={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Documents Table / Cards */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
                  Processed Documents Repository ({documents.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {documents.map(doc => (
                    <div key={doc.id} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600">
                            <FileText size={20} />
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            doc.hasConflicts
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {doc.hasConflicts ? 'Ambiguity Flag' : 'Verified Extraction'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">{doc.name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{doc.facility}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Uploaded {doc.uploadDate} • {doc.fileSize}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                          {doc.extractCount} Items Parsed
                        </span>
                        <button
                          onClick={() => setSelectedDocForModal(doc)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-600 hover:text-white transition flex items-center gap-1"
                        >
                          <Eye size={12} /> JSON Stream
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Parsing Visualizer Modal */}
              {selectedDocForModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className={`max-w-2xl w-full rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-teal-500" />
                        <h3 className="font-bold text-sm">Structured Output: {selectedDocForModal.name}</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedDocForModal(null)}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-semibold">Raw Text Source Snippet:</p>
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 font-mono italic">
                        "{selectedDocForModal.contentSnippet}"
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2 font-semibold">Extracted JSON Schema Output:</p>
                      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
{JSON.stringify({
  document_id: selectedDocForModal.id,
  file_name: selectedDocForModal.name,
  extracted_at: new Date().toISOString(),
  entities: [
    {
      entity_type: "Medication",
      raw_snippet: selectedDocForModal.contentSnippet,
      confidence_score: 0.98,
      actionable_schedule: {
        auto_activated: !selectedDocForModal.hasConflicts,
        flagged_for_human_review: selectedDocForModal.hasConflicts
      }
    }
  ]
}, null, 2)}
                      </pre>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSelectedDocForModal(null)}
                        className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs"
                      >
                        Close View
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* VIEW 4: REVIEW & EVIDENCE TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={22} className="text-teal-600" />
                  Review & Evidence Verification Timeline
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Chronological trail displaying extracted clinical instructions placed directly beside their original text snippets for human visual verification.
                </p>
              </div>

              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={item.id} className={`p-5 rounded-2xl border transition ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Actionable Extracted Data */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.type === 'Medication' 
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20' 
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Category: {item.category}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-slate-400 text-[10px] block">Dose</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.dose}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                            <span className="text-slate-400 text-[10px] block">Frequency</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.frequency}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className={`text-xs font-semibold flex items-center gap-1 ${
                            item.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {item.verified ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                            {item.verified ? 'Human Verified' : 'Awaiting Sign-off'}
                          </span>

                          {!item.verified && (
                            <button
                              onClick={() => handleVerifyTimelineItem(item.id)}
                              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-sm"
                            >
                              Verify & Activate
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right: Source Document Snippet Evidence */}
                      <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                        darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                            <FileText size={14} className="text-teal-600" />
                            <span>{item.docName} (Page {item.page})</span>
                          </div>
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic">
                            "{item.sourceSnippet}"
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3 text-right">
                          OCR Confidence Match: 99.4%
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: CONFLICT & UNCERTAINTY FLAGGING HUB */}
          {activeTab === 'conflicts' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={22} className="text-amber-500" />
                  Conflict & Uncertainty Flagging Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ActionLoop safety protocols prevent auto-activation when conflicting instructions exist across documents. Explicit user sign-off is required below.
                </p>
              </div>

              {conflicts.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">No Unresolved Conflicts</h3>
                  <p className="text-xs text-slate-500 mt-1">All extracted prescriptions are consistent and cleared for active scheduling.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conflicts.map(conf => (
                    <div key={conf.id} className={`p-6 rounded-2xl border-2 transition ${
                      darkMode ? 'bg-slate-900 border-amber-500/40' : 'bg-amber-50/40 border-amber-200 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">{conf.title}</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white">
                          {conf.severity} Priority
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                        {conf.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-[11px] font-semibold text-slate-400 mb-1">Conflicting Source Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {conf.docsInvolved.map((d, i) => (
                            <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resolution Choice Action Panel */}
                      <div className="pt-4 border-t border-amber-200 dark:border-slate-800 space-y-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                          Human-in-the-Loop Resolution Options:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {conf.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleResolveConflict(conf.id, opt)}
                              className="p-3 rounded-xl border border-teal-500/30 hover:border-teal-500 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-left text-xs font-semibold text-slate-800 dark:text-slate-100 transition shadow-sm flex items-center justify-between"
                            >
                              <span>{opt}</span>
                              <ChevronRight size={14} className="text-teal-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: REMINDER ENGINE & ADHERENCE LOG */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={22} className="text-teal-600" />
                  Reminder Engine & Adherence History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Active medication schedules and timestamped compliance records.
                </p>
              </div>

              {/* Active Reminders Management */}
              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">
                  Today's Active Schedule
                </h3>

                <div className="space-y-3">
                  {reminders.map(rem => (
                    <div key={rem.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                      darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{rem.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 font-semibold">{rem.time}</span>
                        </div>
                        <p className="text-xs text-slate-500">{rem.instructions}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReminderStatus(rem.id, 'Taken')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            rem.status === 'Taken'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          Taken
                        </button>
                        <button
                          onClick={() => handleReminderStatus(rem.id, 'Skipped')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            rem.status === 'Skipped'
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          Skipped
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adherence History Log Table */}
              <div className={`p-6 rounded-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-teal-600" />
                  Acknowledgement Compliance Log
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Item / Medication</th>
                        <th className="py-2.5 px-3">Logged Status</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {adherenceLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-3 font-mono text-slate-500">{log.date}</td>
                          <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{log.item}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'Taken'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-500/10 text-slate-500'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{log.timeLogged}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* --- MOBILE BOTTOM TASKBAR NAVIGATION --- */}
      <nav className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-md transition-colors ${
        darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="grid grid-cols-5 h-16">
          <MobileNavButton
            icon={<Activity size={20} />}
            label="Home"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <MobileNavButton
            icon={<UploadCloud size={20} />}
            label="Upload"
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
          />
          <MobileNavButton
            icon={<BookOpen size={20} />}
            label="Timeline"
            active={activeTab === 'timeline'}
            onClick={() => setActiveTab('timeline')}
          />
          <MobileNavButton
            icon={<ShieldAlert size={20} />}
            label="Flags"
            active={activeTab === 'conflicts'}
            onClick={() => setActiveTab('conflicts')}
            badge={conflicts.length}
          />
          <MobileNavButton
            icon={<Clock size={20} />}
            label="Engine"
            active={activeTab === 'reminders'}
            onClick={() => setActiveTab('reminders')}
          />
        </div>
      </nav>

    </div>
  );
}

// --- HELPER SUB-COMPONENTS ---
function NavButton({ icon, label, active, onClick, badge, badgeColor = "bg-teal-600 text-white" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
        active
          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge !== undefined && badge !== null && badge > 0 && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function MobileNavButton({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 ${
        active ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
      {badge > 0 && (
        <span className="absolute top-2 right-4 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

function MetricCard({ title, value, subtext, icon, darkMode }) {
  return (
    <div className={`p-4 rounded-2xl border transition ${
      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>
      <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>
    </div>
  );
}
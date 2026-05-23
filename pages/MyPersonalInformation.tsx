import { Mail, Phone, Calendar, MapPin, User, Upload, Download, Trash2, CheckCircle2, XCircle, GraduationCap, Shield, FileText, Pencil, BookOpen, MoreVertical, Eye, Award, X, UploadCloud, PenLine, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getSignature, uploadSignature, removeSignature, subscribe as subscribeSignature, getCurrentUserId } from "../lib/signatureStore";

type TrainingRecord = {
  id: number;
  courseName: string;
  provider: string;
  startDate: string;
  endDate: string;
  status: string;
  hoursCompleted: number;
  type: string;
  certificateUploaded: boolean;
  certificateFileName: string | null;
  certificateFileSize: string | null;
  certificateUploadDate: string | null;
};

export function MyPersonalInformation() {
  const [activeTab, setActiveTab] = useState("personal");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [viewTraining, setViewTraining] = useState<TrainingRecord | null>(null);
  const [completeTraining, setCompleteTraining] = useState<TrainingRecord | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [viewCertTraining, setViewCertTraining] = useState<TrainingRecord | null>(null);
  const [uploadCertTraining, setUploadCertTraining] = useState<TrainingRecord | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [attendTraining, setAttendTraining] = useState<TrainingRecord | null>(null);
  const [attendFile, setAttendFile] = useState<File | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingRecord[]>([
    { id: 1, courseName: "Advanced Leadership Skills", provider: "Leadership Institute", startDate: "Mar 15, 2024", endDate: "Apr 15, 2024", status: "Completed", hoursCompleted: 40, type: "External", certificateUploaded: true, certificateFileName: "leadership_certificate.pdf", certificateFileSize: "245.3 KB", certificateUploadDate: "Apr 20, 2024" },
    { id: 2, courseName: "Financial Management for NGOs", provider: "NGO Training Center", startDate: "Jul 01, 2024", endDate: "Jul 30, 2024", status: "Completed", hoursCompleted: 32, type: "Internal", certificateUploaded: true, certificateFileName: "financial_mgmt_cert.pdf", certificateFileSize: "189.7 KB", certificateUploadDate: "Aug 05, 2024" },
    { id: 3, courseName: "Data Analysis and Reporting", provider: "Online Learning Platform", startDate: "Nov 10, 2025", endDate: "Dec 20, 2025", status: "In Progress", hoursCompleted: 24, type: "External", certificateUploaded: false, certificateFileName: null, certificateFileSize: null, certificateUploadDate: null },
    { id: 4, courseName: "Mindfulness & Stress Management", provider: "Self-enrolled", startDate: "Jan 05, 2026", endDate: "Feb 28, 2026", status: "In Progress", hoursCompleted: 10, type: "Personal Development", certificateUploaded: false, certificateFileName: null, certificateFileSize: null, certificateUploadDate: null },
    { id: 5, courseName: "Effective Communication Workshop", provider: "HR Department", startDate: "Sep 10, 2024", endDate: "Sep 12, 2024", status: "Completed", hoursCompleted: 16, type: "Internal", certificateUploaded: true, certificateFileName: "comm_workshop_honor.jpg", certificateFileSize: "512.1 KB", certificateUploadDate: "Sep 20, 2024" },
  ]);
  // Signature state
  const [signatureData, setSignatureData] = useState(getSignature());
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [showRemoveSignatureConfirm, setShowRemoveSignatureConfirm] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subscribe to signature store
  useEffect(() => {
    const unsub = subscribeSignature(() => setSignatureData(getSignature()));
    return unsub;
  }, []);

  const handleSignatureFileSelect = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) return;
    if (file.size > 2 * 1024 * 1024) return; // max 2MB
    setSignatureFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSignaturePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSignature = () => {
    if (!signatureFile || !signaturePreview) return;
    uploadSignature(signaturePreview, signatureFile.name, `${(signatureFile.size / 1024).toFixed(1)} KB`);
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  const handleRemoveSignature = () => {
    removeSignature();
    setShowRemoveSignatureConfirm(false);
  };

  const isTrainingEnded = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date("2026-03-01");
    return end <= today;
  };

  const handleCompleteTraining = () => {
    if (!completeTraining) return;
    setTrainingData(prev => prev.map(t =>
      t.id === completeTraining.id
        ? {
            ...t,
            status: "Completed",
            certificateUploaded: uploadedFile ? true : t.certificateUploaded,
            certificateFileName: uploadedFile ? uploadedFile.name : t.certificateFileName,
            certificateFileSize: uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : t.certificateFileSize,
            certificateUploadDate: uploadedFile ? "Mar 01, 2026" : t.certificateUploadDate,
          }
        : t
    ));
    setCompleteTraining(null);
    setUploadedFile(null);
  };

  const handleRemoveCertificate = (trainingId: number) => {
    setTrainingData(prev => prev.map(t =>
      t.id === trainingId
        ? { ...t, certificateUploaded: false, certificateFileName: null, certificateFileSize: null, certificateUploadDate: null }
        : t
    ));
    setViewCertTraining(null);
  };

  const handleUploadCertificate = () => {
    if (!uploadCertTraining || !certFile) return;
    setTrainingData(prev => prev.map(t =>
      t.id === uploadCertTraining.id
        ? {
            ...t,
            certificateUploaded: true,
            certificateFileName: certFile.name,
            certificateFileSize: `${(certFile.size / 1024).toFixed(1)} KB`,
            certificateUploadDate: "Mar 01, 2026",
          }
        : t
    ));
    setUploadCertTraining(null);
    setCertFile(null);
  };

  const handleMarkAttended = () => {
    if (!attendTraining || !attendFile) return;
    setTrainingData(prev => prev.map(t =>
      t.id === attendTraining.id
        ? {
            ...t,
            status: "Completed",
            certificateUploaded: true,
            certificateFileName: attendFile.name,
            certificateFileSize: `${(attendFile.size / 1024).toFixed(1)} KB`,
            certificateUploadDate: "Mar 30, 2026",
          }
        : t
    ));
    setAttendTraining(null);
    setAttendFile(null);
  };

  const tabs = [
    { id: "personal", label: "Personal Information" },
    { id: "qualifications", label: "Qualifications" },
    { id: "contract", label: "Contract" },
    { id: "training", label: "Training" },
    { id: "disciplinary", label: "Disciplinary Actions" },
    { id: "leave", label: "Leave" },
    { id: "signature", label: "My Signature" },
  ];

  const certifications = [
    { name: "Bachelor's Degree in Business Administration", date: "Jun 2014", file: "degree.pdf", institution: "University of Ghana", type: "Degree" },
    { name: "Project Management Professional (PMP)", date: "Mar 2017", file: "pmp_cert.pdf", institution: "PMI", type: "Professional Certification" },
    { name: "Certified ScrumMaster (CSM)", date: "Aug 2019", file: "csm_cert.pdf", institution: "Scrum Alliance", type: "Professional Certification" },
  ];

  // Employee gender — determines Paternity vs Maternity leave card
  const employeeGender: "Male" | "Female" = "Male";

  const leaveSummary = {
    paternityMaternity: { total: 10, taken: 0, remaining: 10 },
    annualLeave: { total: 25, taken: 8, remaining: 17 },
    sicknessAbsence: { total: 15, taken: 3, remaining: 12 },
    bereavement: { total: 5, taken: 0, remaining: 5 },
    unpaidLeave: { total: 30, taken: 2, remaining: 28 },
  };

  const leaveHistory = [
    { id: 1, leaveType: "Annual Leave", startDate: "Dec 20, 2025", endDate: "Dec 27, 2025", duration: 6, status: "Approved", requestDate: "Dec 01, 2025", approvedBy: "Jane Doe" },
    { id: 2, leaveType: "Sickness Absence", startDate: "Nov 10, 2025", endDate: "Nov 12, 2025", duration: 3, status: "Approved", requestDate: "Nov 10, 2025", approvedBy: "Jane Doe" },
    { id: 3, leaveType: "Annual Leave", startDate: "Feb 05, 2026", endDate: "Feb 07, 2026", duration: 3, status: "Pending", requestDate: "Jan 25, 2026", approvedBy: "-" },
    { id: 4, leaveType: "Unpaid Leave", startDate: "Sep 15, 2025", endDate: "Sep 16, 2025", duration: 2, status: "Approved", requestDate: "Sep 01, 2025", approvedBy: "Jane Doe" },
    { id: 5, leaveType: "Annual Leave", startDate: "Aug 15, 2025", endDate: "Aug 16, 2025", duration: 2, status: "Approved", requestDate: "Aug 01, 2025", approvedBy: "Jane Doe" },
    { id: 6, leaveType: "Bereavement", startDate: "Jul 02, 2025", endDate: "Jul 04, 2025", duration: 3, status: "Approved", requestDate: "Jul 01, 2025", approvedBy: "Jane Doe" },
    { id: 7, leaveType: "Annual Leave", startDate: "May 10, 2025", endDate: "May 12, 2025", duration: 3, status: "Rejected", requestDate: "May 01, 2025", approvedBy: "Jane Doe" },
  ];

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Not Started": return "bg-slate-50 text-slate-600 border-slate-200";
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-600 border-red-200";
      case "Medium": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Low": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getTrainingStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "In Progress": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Scheduled": return "bg-amber-50 text-amber-600 border-amber-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Pending": return "bg-amber-50 text-amber-600 border-amber-200";
      case "Rejected": return "bg-red-50 text-red-600 border-red-200";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  function InfoField({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-center gap-1.5">
          {icon}
          <p className="text-[13px] text-slate-900">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">My Personal Information</h1>
        <p className="text-[12px] text-slate-500">View and manage your profile, tasks, qualifications, and more</p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-5 max-w-[1200px]">
          {/* Employee Profile Card — Full Width */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Gradient Banner */}
            <div className="h-20 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={32} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 pb-5 px-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-[18px] text-slate-900">Kwame Amoah</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border bg-emerald-50 text-emerald-600 border-emerald-200">
                      <CheckCircle2 size={10} />
                      Active
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500 mt-0.5">Senior Software Engineer — Engineering Department</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Employee ID</p>
                  <p className="text-[14px] text-purple-700">EMP0001</p>
                </div>
              </div>

              {/* Quick Info Row */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <Mail size={13} className="text-slate-400" />
                  kwame.amoah@company.com
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <Phone size={13} className="text-slate-400" />
                  +233 24 123 4567
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <MapPin size={13} className="text-slate-400" />
                  Accra Head Office
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <Calendar size={13} className="text-slate-400" />
                  Joined Mar 01, 2018
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  <User size={13} className="text-slate-400" />
                  Reports to: Jane Doe
                </div>
              </div>
            </div>
          </div>

          {/* Tabs — Pill Style matching DocumentVault */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shrink-0">
            <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-purple-700 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              {/* Edit Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                  <Pencil size={14} />
                  Edit Information
                </button>
              </div>
              {/* Basic Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Basic Information</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="First Name" value="Kwame" />
                  <InfoField label="Last Name" value="Amoah" />
                  <InfoField label="Gender" value="Male" />
                  <InfoField label="Date of Birth" value="May 15, 1990" />
                  <InfoField label="Nationality" value="Ghanaian" />
                  <InfoField label="Marital Status" value="Single" />
                  <div className="col-span-2">
                    <InfoField label="Address" value="45 Liberation Road, Osu, Accra, Ghana" />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Employment Information</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Employee ID" value="EMP0001" />
                  <InfoField label="Start Date" value="Mar 01, 2018" />
                  <InfoField label="Job Title" value="Senior Software Engineer" />
                  <InfoField label="Department" value="Engineering" />
                  <InfoField label="Employment Type" value="Full-time" />
                  <InfoField label="Employment Status" value="Active" />
                  <InfoField label="Supervisor" value="Jane Doe" />
                  <InfoField label="Work Location" value="Accra Office" />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Contact Information</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Phone Number" value="+233 24 123 4567" />
                  <InfoField label="Email" value="kwame.amoah@company.com" />
                  <InfoField label="Emergency Contact" value="+233 20 987 6543" />
                  <InfoField label="Emergency Contact Name" value="Ama Amoah" />
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Banking Information</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Bank Name" value="Ghana Commercial Bank" />
                  <InfoField label="Account Number" value="•••••••890" />
                  <InfoField label="Account Type" value="Savings" />
                  <InfoField label="Branch" value="Accra Main Branch" />
                </div>
              </div>

              {/* Utilization & Performance */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Utilization & Performance</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Current Utilization Rate</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: "80%" }} />
                      </div>
                      <span className="text-[13px] text-slate-900">80%</span>
                    </div>
                  </div>
                  <InfoField label="Billable Hours (This Month)" value="128 hrs" />
                  <InfoField label="Non-Billable Hours" value="32 hrs" />
                  <InfoField label="Available Hours" value="160 hrs" />
                  <InfoField label="Active Projects" value="4" />
                  <InfoField label="Completed Projects (YTD)" value="8" />
                  <InfoField label="Tasks Completed (This Month)" value="24" />
                  <InfoField label="Avg. Task Completion Time" value="2.8 days" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">On-Time Delivery Rate</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                      </div>
                      <span className="text-[13px] text-slate-900">95%</span>
                    </div>
                  </div>
                  <InfoField label="Avg. Performance Rating" value="4.7 / 5.0" />
                  <InfoField label="Last Performance Review" value="Dec 20, 2025" />
                  <InfoField label="Next Performance Review" value="Dec 20, 2026" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "qualifications" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                  <Upload size={14} />
                  Upload Certification
                </button>
              </div>

              {/* Educational Qualifications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={14} className="text-purple-600" />
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest">Educational Qualifications</p>
                </div>
                <div className="space-y-3">
                  {certifications.filter(c => c.type === "Degree").map((cert, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <GraduationCap size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-900">{cert.name}</p>
                        <p className="text-[11px] text-slate-500">{cert.institution} — {cert.date}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"><Download size={14} className="text-purple-600" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Certifications */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={14} className="text-purple-600" />
                  <p className="text-[10px] text-purple-700 uppercase tracking-widest">Professional Certifications</p>
                </div>
                <div className="space-y-3">
                  {certifications.filter(c => c.type === "Professional Certification").map((cert, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Shield size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-900">{cert.name}</p>
                        <p className="text-[11px] text-slate-500">{cert.institution} — {cert.date}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors"><Download size={14} className="text-purple-600" /></button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contract" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Employment Contract Details</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Contract Start Date" value="Mar 01, 2018" />
                  <InfoField label="Contract End Date" value="Permanent" />
                  <InfoField label="Employment Type" value="Full-time" />
                  <InfoField label="Probation Status" value="Completed" />
                  <InfoField label="Job Title" value="Senior Software Engineer" />
                  <InfoField label="Department" value="Engineering" />
                  <InfoField label="Reporting To" value="Head of Engineering" />
                  <InfoField label="Work Location" value="Accra Office" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Compensation & Benefits</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Base Salary" value="GHS 12,000/month" />
                  <InfoField label="Pay Frequency" value="Monthly" />
                  <InfoField label="Direct Manager" value="Jane Doe" />
                  <InfoField label="Performance Bonus Eligible" value="Yes" />
                  <InfoField label="Health Insurance" value="Included" />
                  <InfoField label="Pension Contribution" value="13.5% (Employer)" />
                  <InfoField label="Life Insurance" value="Included" />
                  <InfoField label="Professional Development" value="GHS 5,000/year" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Leave Entitlements</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Annual Leave Days" value="25 days" />
                  <InfoField label="Sick Leave Days" value="15 days" />
                  <InfoField label="Casual Leave Days" value="5 days" />
                  <InfoField label="Compassionate Leave" value="As needed" />
                  <InfoField label="Maternity/Paternity Leave" value="As per policy" />
                  <InfoField label="Study Leave" value="Upon approval" />
                  <InfoField label="Leave Accrual Start" value="Mar 01, 2018" />
                  <InfoField label="Leave Year End" value="December 31" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Working Hours & Schedule</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Working Hours" value="40 hours/week" />
                  <InfoField label="Work Schedule" value="Monday – Friday" />
                  <InfoField label="Start Time" value="8:00 AM" />
                  <InfoField label="End Time" value="5:00 PM" />
                  <InfoField label="Lunch Break" value="1 hour" />
                  <InfoField label="Remote Work Policy" value="2 days/week" />
                  <InfoField label="Overtime Eligible" value="No" />
                  <InfoField label="Flexible Hours" value="Yes" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-4">Contract Terms & Conditions</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  <InfoField label="Notice Period" value="30 days" />
                  <InfoField label="Contract Renewal Date" value="N/A (Permanent)" />
                  <InfoField label="Confidentiality Agreement" value="Signed" />
                  <InfoField label="Non-Compete Clause" value="Not Applicable" />
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Additional Notes</p>
                  <p className="text-[12px] text-slate-600 leading-relaxed">Standard full-time employment contract with benefits package including health insurance, pension contributions, and performance bonuses. Employee is subject to annual performance reviews and entitled to professional development opportunities.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                  <BookOpen size={14} />
                  Personal Development
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {trainingData.length > 0 ? (
                  <table className="w-full">
                    <thead className="sticky top-0 z-[5]" style={{ backgroundColor: "#0B01D0" }}>
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Course Name</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Provider</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Start Date</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">End Date</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Hours</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Type</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Certificate Uploaded</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Attended</th>
                        <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingData.map((t, idx) => (
                        <tr key={t.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                          <td className="px-6 py-3 text-[12px] text-slate-900">{t.courseName}</td>
                          <td className="px-6 py-3 text-[12px] text-slate-600">{t.provider}</td>
                          <td className="px-6 py-3 text-[12px] text-slate-500">{t.startDate}</td>
                          <td className="px-6 py-3 text-[12px] text-slate-500">{t.endDate}</td>
                          <td className="px-6 py-3 text-[12px] text-slate-600">{t.hoursCompleted} hrs</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getTrainingStatusColor(t.status)}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-[12px] text-slate-500">{t.type}</td>
                          <td className="px-6 py-3">
                            {t.certificateUploaded ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border bg-emerald-50 text-emerald-600 border-emerald-200">
                                <CheckCircle2 size={10} />
                                Uploaded
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border bg-red-50 text-red-600 border-red-200">
                                <XCircle size={10} />
                                Not Uploaded
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            {t.status === "Completed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border bg-emerald-50 text-emerald-600 border-emerald-200">
                                <CheckCircle2 size={10} />
                                Attended
                              </span>
                            ) : (
                              <button
                                onClick={() => { setAttendTraining(t); setAttendFile(null); }}
                                className="px-3 py-1 bg-purple-700 text-white rounded-lg text-[11px] hover:bg-purple-800 transition-colors whitespace-nowrap"
                              >
                                Attended
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <div className="relative" ref={openMenuId === t.id ? menuRef : undefined}>
                              <button
                                onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <MoreVertical size={16} className="text-slate-500" />
                              </button>
                              {openMenuId === t.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                                  <button
                                    onClick={() => { setViewTraining(t); setOpenMenuId(null); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <Eye size={14} className="text-slate-400" />
                                    View Details
                                  </button>
                                  {t.status !== "Completed" && isTrainingEnded(t.endDate) && (
                                    <button
                                      onClick={() => { setCompleteTraining(t); setOpenMenuId(null); }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                      <Award size={14} className="text-purple-500" />
                                      Complete Training
                                    </button>
                                  )}
                                  {t.certificateUploaded && (
                                    <>
                                      <button
                                        onClick={() => { setViewCertTraining(t); setOpenMenuId(null); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
                                      >
                                        <FileText size={14} className="text-emerald-500" />
                                        View Certificate
                                      </button>
                                      <button
                                        onClick={() => { handleRemoveCertificate(t.id); setOpenMenuId(null); }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                                      >
                                        <Trash2 size={14} className="text-red-400" />
                                        Remove Certificate
                                      </button>
                                    </>
                                  )}
                                  {!t.certificateUploaded && (
                                    <button
                                      onClick={() => { setUploadCertTraining(t); setOpenMenuId(null); }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                      <UploadCloud size={14} className="text-blue-500" />
                                      Upload Certificate
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-16">
                    <FileText size={40} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No training records found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "disciplinary" && (
            <div className="bg-white border border-slate-200 rounded-xl">
              <div className="text-center py-16">
                <CheckCircle2 size={40} className="text-emerald-200 mx-auto mb-3" />
                <p className="text-[14px] text-slate-900">No Disciplinary Actions</p>
                <p className="text-[12px] text-slate-400 mt-1">No disciplinary actions on record.</p>
              </div>
            </div>
          )}

          {activeTab === "leave" && (
            <div className="space-y-4">
              {/* Leave Summary Cards */}
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: employeeGender === "Male" ? "Paternity Leave" : "Maternity Leave", data: leaveSummary.paternityMaternity, color: "bg-pink-500" },
                  { label: "Annual Leave", data: leaveSummary.annualLeave, color: "bg-purple-500" },
                  { label: "Sickness Absence", data: leaveSummary.sicknessAbsence, color: "bg-blue-500" },
                  { label: "Bereavement", data: leaveSummary.bereavement, color: "bg-slate-500" },
                  { label: "Unpaid Leave", data: leaveSummary.unpaidLeave, color: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-5">
                    <p className="text-[11px] text-slate-500 mb-3">{item.label}</p>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="text-[24px] text-slate-900">{item.data.remaining}</span>
                      <span className="text-[12px] text-slate-400 pb-1">of {item.data.total} days remaining</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${(item.data.remaining / item.data.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-400">{item.data.taken} days taken</span>
                      <span className="text-[10px] text-slate-400">{item.data.remaining} remaining</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave History Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="sticky top-0 z-[5]" style={{ backgroundColor: "#0B01D0" }}>
                    <tr>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Leave Type</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Start Date</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">End Date</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Duration</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Request Date</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Approved By</th>
                      <th className="text-left px-6 py-3 text-[12px] text-white font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((leave, idx) => (
                      <tr key={leave.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                        <td className="px-6 py-3 text-[12px] text-slate-900">{leave.leaveType}</td>
                        <td className="px-6 py-3 text-[12px] text-slate-500">{leave.startDate}</td>
                        <td className="px-6 py-3 text-[12px] text-slate-500">{leave.endDate}</td>
                        <td className="px-6 py-3 text-[12px] text-slate-600">{leave.duration} days</td>
                        <td className="px-6 py-3 text-[12px] text-slate-500">{leave.requestDate}</td>
                        <td className="px-6 py-3 text-[12px] text-slate-600">{leave.approvedBy}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getLeaveStatusColor(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "signature" && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[13px] text-blue-900">Your uploaded signature will be used for digitally signing contracts, purchase orders, and other official documents.</p>
                  <p className="text-[11px] text-blue-600 mt-1">Only you can use your signature. It cannot be applied by anyone else.</p>
                </div>
              </div>

              {signatureData ? (
                <>
                  {/* Current Signature Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <PenLine size={14} className="text-purple-600" />
                      <p className="text-[10px] text-purple-700 uppercase tracking-widest">Current Signature</p>
                    </div>
                    <div className="flex items-start gap-6">
                      {/* Signature Preview */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 flex items-center justify-center" style={{ minWidth: 280, minHeight: 140 }}>
                        <img src={signatureData.dataUrl} alt="My Signature" className="max-w-[260px] max-h-[120px] object-contain" />
                      </div>
                      {/* Signature Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">File Name</p>
                          <p className="text-[13px] text-slate-900">{signatureData.fileName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">File Size</p>
                          <p className="text-[13px] text-slate-900">{signatureData.fileSize}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Uploaded On</p>
                          <p className="text-[13px] text-slate-900">{new Date(signatureData.uploadedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Owner</p>
                          <p className="text-[13px] text-slate-900">{signatureData.employeeName} ({signatureData.employeeId})</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <p className="text-[12px] text-emerald-600">Ready for use</p>
                        </div>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => signatureInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"
                      >
                        <UploadCloud size={14} />
                        Replace Signature
                      </button>
                      <button
                        onClick={() => setShowRemoveSignatureConfirm(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg text-[13px] hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                      <input
                        ref={signatureInputRef}
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleSignatureFileSelect(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>

                  {/* Preview of replacement (if selected) */}
                  {signaturePreview && (
                    <div className="bg-white border border-amber-200 rounded-xl p-5">
                      <p className="text-[10px] text-amber-700 uppercase tracking-widest mb-3">New Signature Preview</p>
                      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-center mb-4" style={{ minHeight: 120 }}>
                        <img src={signaturePreview} alt="New Signature Preview" className="max-w-[260px] max-h-[100px] object-contain" />
                      </div>
                      <p className="text-[12px] text-slate-600 mb-3">{signatureFile?.name} &middot; {signatureFile ? `${(signatureFile.size / 1024).toFixed(1)} KB` : ""}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={handleUploadSignature} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                          Confirm Replacement
                        </button>
                        <button onClick={() => { setSignatureFile(null); setSignaturePreview(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Upload Area — No signature yet */
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <PenLine size={14} className="text-purple-600" />
                    <p className="text-[10px] text-purple-700 uppercase tracking-widest">Upload Signature</p>
                  </div>
                  <p className="text-[12px] text-slate-500 mb-4">Upload a PNG or JPEG image of your handwritten signature. This will be used for digitally signing official documents.</p>

                  {signaturePreview ? (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50/30 flex items-center justify-center" style={{ minHeight: 160 }}>
                        <img src={signaturePreview} alt="Signature Preview" className="max-w-[300px] max-h-[120px] object-contain" />
                      </div>
                      <p className="text-[12px] text-slate-600">{signatureFile?.name} &middot; {signatureFile ? `${(signatureFile.size / 1024).toFixed(1)} KB` : ""}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={handleUploadSignature} className="flex items-center gap-1.5 px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                          <Upload size={14} />
                          Save Signature
                        </button>
                        <button onClick={() => { setSignatureFile(null); setSignaturePreview(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                          <PenLine size={24} className="text-purple-600" />
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] text-slate-700">Click to upload your signature</p>
                          <p className="text-[11px] text-slate-400 mt-1">PNG or JPEG only &middot; Max 2 MB</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Use a clean white background for best results</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleSignatureFileSelect(e.target.files[0]);
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Guidelines Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-slate-500" />
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Signature Guidelines</p>
                </div>
                <ul className="space-y-2">
                  {[
                    "Your signature image must be a clear scan or photo of your handwritten signature on a white background.",
                    "Accepted formats: PNG or JPEG. Maximum file size: 2 MB.",
                    "Your signature is personal and can only be applied by you. No other user can access or use it.",
                    "You can replace or remove your signature at any time from this page.",
                    "Once uploaded, you can apply your signature to contracts, purchase orders, and other documents that require signing.",
                  ].map((guideline, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                      <p className="text-[12px] text-slate-600">{guideline}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remove Signature Confirmation Modal */}
      {showRemoveSignatureConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowRemoveSignatureConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Remove Signature</h3>
              <button onClick={() => setShowRemoveSignatureConfirm(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-700">Are you sure you want to remove your signature? You will not be able to sign any documents until a new signature is uploaded.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setShowRemoveSignatureConfirm(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleRemoveSignature} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors">
                Remove Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Training Details Modal */}
      {viewTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewTraining(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Training Details</h3>
              <button onClick={() => setViewTraining(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="Course Name" value={viewTraining.courseName} />
                <InfoField label="Provider" value={viewTraining.provider} />
                <InfoField label="Start Date" value={viewTraining.startDate} />
                <InfoField label="End Date" value={viewTraining.endDate} />
                <InfoField label="Hours Completed" value={`${viewTraining.hoursCompleted} hrs`} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getTrainingStatusColor(viewTraining.status)}`}>
                    {viewTraining.status}
                  </span>
                </div>
                <InfoField label="Type" value={viewTraining.type} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Certificate</p>
                  {viewTraining.certificateUploaded ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border bg-emerald-50 text-emerald-600 border-emerald-200">
                      <CheckCircle2 size={10} />
                      Uploaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border bg-red-50 text-red-600 border-red-200">
                      <XCircle size={10} />
                      Not Uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setViewTraining(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Training Modal */}
      {completeTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setCompleteTraining(null); setUploadedFile(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Complete Training</h3>
              <button onClick={() => { setCompleteTraining(null); setUploadedFile(null); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoField label="Course Name" value={completeTraining.courseName} />
                  <InfoField label="Provider" value={completeTraining.provider} />
                  <InfoField label="Start Date" value={completeTraining.startDate} />
                  <InfoField label="End Date" value={completeTraining.endDate} />
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-900 uppercase tracking-wider mb-2">Upload Honor Certificate</p>
                <p className="text-[12px] text-slate-500 mb-3">Please upload your certificate of completion for this training.</p>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  {uploadedFile ? (
                    <div className="flex items-center gap-2 text-[13px] text-slate-700">
                      <FileText size={20} className="text-purple-600" />
                      <div>
                        <p className="text-slate-900">{uploadedFile.name}</p>
                        <p className="text-[11px] text-slate-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-slate-300" />
                      <p className="text-[12px] text-slate-500">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG (max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0]); }}
                  />
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setCompleteTraining(null); setUploadedFile(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleCompleteTraining} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Certificate Modal */}
      {viewCertTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewCertTraining(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Training Certificate</h3>
              <button onClick={() => setViewCertTraining(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Training Info Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoField label="Course Name" value={viewCertTraining.courseName} />
                  <InfoField label="Provider" value={viewCertTraining.provider} />
                  <InfoField label="Type" value={viewCertTraining.type} />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getTrainingStatusColor(viewCertTraining.status)}`}>
                      {viewCertTraining.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certificate File Details */}
              <div>
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Certificate File</p>
                <div className="flex items-center gap-4 px-4 py-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Award size={20} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-900 truncate">{viewCertTraining.certificateFileName}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-slate-500">{viewCertTraining.certificateFileSize}</span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500">Uploaded {viewCertTraining.certificateUploadDate}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-emerald-100 rounded-lg transition-colors shrink-0" title="Download">
                    <Download size={16} className="text-emerald-600" />
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const training = viewCertTraining;
                    setViewCertTraining(null);
                    handleRemoveCertificate(training.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                >
                  <Trash2 size={13} />
                  Remove
                </button>
                <button
                  onClick={() => {
                    const training = viewCertTraining;
                    setViewCertTraining(null);
                    handleRemoveCertificate(training.id);
                    setTimeout(() => {
                      setUploadCertTraining(trainingData.find(t => t.id === training.id) || training);
                    }, 100);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <UploadCloud size={13} />
                  Reupload
                </button>
              </div>
              <button onClick={() => setViewCertTraining(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attended Modal */}
      {attendTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setAttendTraining(null); setAttendFile(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Mark as Attended</h3>
              <button onClick={() => { setAttendTraining(null); setAttendFile(null); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Training Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoField label="Course Name" value={attendTraining.courseName} />
                  <InfoField label="Provider" value={attendTraining.provider} />
                  <InfoField label="Start Date" value={attendTraining.startDate} />
                  <InfoField label="End Date" value={attendTraining.endDate} />
                </div>
              </div>

              {/* Info note */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <Award size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[12px] text-blue-800">
                  Please upload your honor certificate to confirm attendance. The training will be marked as{" "}
                  <span className="font-semibold">Completed</span> once submitted.
                </p>
              </div>

              {/* Upload Area */}
              <div>
                <p className="text-[11px] text-slate-900 uppercase tracking-wider mb-2">
                  Upload Honor Certificate <span className="text-red-500">*</span>
                </p>
                <p className="text-[12px] text-slate-500 mb-3">
                  Upload the honor certificate issued to you for attending this training.
                </p>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  {attendFile ? (
                    <div className="flex items-center gap-3 px-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-900">{attendFile.name}</p>
                        <p className="text-[11px] text-slate-400">{(attendFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud size={28} className="text-slate-300" />
                      <p className="text-[12px] text-slate-500">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG (max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => { if (e.target.files?.[0]) setAttendFile(e.target.files[0]); }}
                  />
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => { setAttendTraining(null); setAttendFile(null); }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAttended}
                disabled={!attendFile}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit & Mark Attended
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Certificate Modal */}
      {uploadCertTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setUploadCertTraining(null); setCertFile(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] text-slate-900">Upload Certificate</h3>
              <button onClick={() => { setUploadCertTraining(null); setCertFile(null); }} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoField label="Course Name" value={uploadCertTraining.courseName} />
                  <InfoField label="Provider" value={uploadCertTraining.provider} />
                  <InfoField label="Start Date" value={uploadCertTraining.startDate} />
                  <InfoField label="End Date" value={uploadCertTraining.endDate} />
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-900 uppercase tracking-wider mb-2">Upload Honor Certificate</p>
                <p className="text-[12px] text-slate-500 mb-3">Please upload your certificate of completion for this training.</p>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
                  {certFile ? (
                    <div className="flex items-center gap-2 text-[13px] text-slate-700">
                      <FileText size={20} className="text-purple-600" />
                      <div>
                        <p className="text-slate-900">{certFile.name}</p>
                        <p className="text-[11px] text-slate-400">{(certFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud size={24} className="text-slate-300" />
                      <p className="text-[12px] text-slate-500">Click to upload or drag and drop</p>
                      <p className="text-[10px] text-slate-400">PDF, JPG, PNG (max 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => { if (e.target.files?.[0]) setCertFile(e.target.files[0]); }}
                  />
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => { setUploadCertTraining(null); setCertFile(null); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-[13px] hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleUploadCertificate} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors">
                Upload Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
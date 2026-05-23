import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check, Upload, Trash2, User, FileText, UploadCloud, AlertTriangle, Info } from "lucide-react";

interface AddNewEmployeeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  departments: string[];
  positions: string[];
}

const STEPS = [
  { id: 1, label: "Personal Information" },
  { id: 2, label: "Employment Details" },
  { id: 3, label: "Contract & Compensation" },
  { id: 4, label: "Qualifications & Banking" },
  { id: 5, label: "Review & Submit" },
];

// Job titles with linked department and salary range data
const JOB_TITLES_DATA = [
  { title: "Senior Project Manager", department: "Project Management", level: "Senior", grade: "Grade 10", salaryMin: 60000, salaryMax: 80000, salaryRange: "$60,000 - $80,000" },
  { title: "Finance Officer", department: "Financial Management", level: "Mid-Level", grade: "Grade 7", salaryMin: 40000, salaryMax: 55000, salaryRange: "$40,000 - $55,000" },
  { title: "HR Manager", department: "HR Management", level: "Senior", grade: "Grade 9", salaryMin: 55000, salaryMax: 70000, salaryRange: "$55,000 - $70,000" },
  { title: "M&E Specialist", department: "Monitoring & Evaluation", level: "Mid-Level", grade: "Grade 8", salaryMin: 45000, salaryMax: 60000, salaryRange: "$45,000 - $60,000" },
  { title: "Procurement Officer", department: "Procurement", level: "Junior", grade: "Grade 6", salaryMin: 35000, salaryMax: 45000, salaryRange: "$35,000 - $45,000" },
  { title: "Administrative Assistant", department: "HR Management", level: "Entry", grade: "Grade 4", salaryMin: 25000, salaryMax: 32000, salaryRange: "$25,000 - $32,000" },
  { title: "Software Engineer", department: "Engineering", level: "Mid-Level", grade: "Grade 7", salaryMin: 42000, salaryMax: 58000, salaryRange: "$42,000 - $58,000" },
  { title: "Senior Software Engineer", department: "Engineering", level: "Senior", grade: "Grade 9", salaryMin: 55000, salaryMax: 75000, salaryRange: "$55,000 - $75,000" },
  { title: "Communications Officer", department: "Communications", level: "Mid-Level", grade: "Grade 6", salaryMin: 35000, salaryMax: 48000, salaryRange: "$35,000 - $48,000" },
  { title: "Legal Officer", department: "Legal", level: "Mid-Level", grade: "Grade 8", salaryMin: 48000, salaryMax: 65000, salaryRange: "$48,000 - $65,000" },
  { title: "Program Manager", department: "Programs", level: "Senior", grade: "Grade 10", salaryMin: 60000, salaryMax: 85000, salaryRange: "$60,000 - $85,000" },
  { title: "Data Analyst", department: "Monitoring & Evaluation", level: "Junior", grade: "Grade 5", salaryMin: 30000, salaryMax: 42000, salaryRange: "$30,000 - $42,000" },
  { title: "Accountant", department: "Financial Management", level: "Mid-Level", grade: "Grade 7", salaryMin: 40000, salaryMax: 52000, salaryRange: "$40,000 - $52,000" },
];

// Available supervisors / managers in the system
const SUPERVISORS = [
  { id: "sup-1", name: "Jane Doe", title: "Head of Engineering", department: "Engineering" },
  { id: "sup-2", name: "Dr. Nana Agyemang", title: "HR Director", department: "HR Management" },
  { id: "sup-3", name: "Emmanuel Tetteh", title: "Operations Director", department: "Operations" },
  { id: "sup-4", name: "James Mensah", title: "Finance Director", department: "Financial Management" },
  { id: "sup-5", name: "Ama Serwaa", title: "Engineering Team Lead", department: "Engineering" },
  { id: "sup-6", name: "Kofi Adomako", title: "Program Director", department: "Programs" },
  { id: "sup-7", name: "Priscilla Boateng", title: "Senior HR Manager", department: "HR Management" },
  { id: "sup-8", name: "Gifty Owusu", title: "Technical Lead", department: "IT" },
  { id: "sup-9", name: "Daniel Asare", title: "Procurement Manager", department: "Procurement" },
  { id: "sup-10", name: "Kweku Mensah", title: "M&E Director", department: "Monitoring & Evaluation" },
];

// Pension contribution tiers (Ghana SSNIT)
const PENSION_TIERS = [
  { id: "tier1", label: "SSNIT Tier 1 — 13.5% (Employer: 13%, Employee: 0.5%)", value: "SSNIT Tier 1 — 13.5%" },
  { id: "tier2", label: "SSNIT Tier 2 — 5% (Employee)", value: "SSNIT Tier 2 — 5%" },
  { id: "tier3", label: "Tier 3 (Voluntary) — Up to 16.5% (Employer + Employee)", value: "Tier 3 (Voluntary) — Up to 16.5%" },
  { id: "tier1_2", label: "SSNIT Tier 1 + 2 Combined — 18.5%", value: "SSNIT Tier 1 + 2 — 18.5%" },
  { id: "all_tiers", label: "All Tiers (1 + 2 + 3) — Up to 35%", value: "All Tiers — Up to 35%" },
  { id: "na", label: "N/A — Not Applicable", value: "N/A" },
];

type Qualification = {
  id: number;
  name: string;
  institution: string;
  date: string;
  type: "Degree" | "Professional Certification";
  fileName: string;
};

export function AddNewEmployeeForm({ onClose, onSubmit, departments, positions }: AddNewEmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Step 2: Employment Details
  const [employeeId, setEmployeeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("Active");
  const [supervisor, setSupervisor] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [startDate, setStartDate] = useState("");

  // Step 3: Contract & Compensation
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [contractEndNA, setContractEndNA] = useState(false);
  const [probationStatus, setProbationStatus] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [payFrequency, setPayFrequency] = useState("Monthly");
  const [bonusEligible, setBonusEligible] = useState("Yes");
  const [healthInsurance, setHealthInsurance] = useState("Included");
  const [pensionContribution, setPensionContribution] = useState("");
  const [lifeInsurance, setLifeInsurance] = useState("Included");
  const [profDevBudget, setProfDevBudget] = useState("");

  // Leave entitlements — pre-populated defaults
  const [paternityMaternityDays, setPaternityMaternityDays] = useState("10");
  const [annualLeaveDays, setAnnualLeaveDays] = useState("22");
  const [sicknessAbsenceDays, setSicknessAbsenceDays] = useState("15");
  const [bereavementDays, setBereavementDays] = useState("5");
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState("30");

  // Working hours
  const [workingHours, setWorkingHours] = useState("40");
  const [workSchedule, setWorkSchedule] = useState("Monday – Friday");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [lunchBreak, setLunchBreak] = useState("1 hour");
  const [remoteWorkPolicy, setRemoteWorkPolicy] = useState("");
  const [overtimeEligible, setOvertimeEligible] = useState("No");
  const [noticePeriod, setNoticePeriod] = useState("30 days");

  // Step 4: Qualifications & Banking
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [newQualName, setNewQualName] = useState("");
  const [newQualInstitution, setNewQualInstitution] = useState("");
  const [newQualDate, setNewQualDate] = useState("");
  const [newQualType, setNewQualType] = useState<"Degree" | "Professional Certification">("Degree");
  const [newQualFile, setNewQualFile] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qualIdCounter = useRef(1);

  // ─── Job Title → Department auto-fill ───
  const selectedJobData = JOB_TITLES_DATA.find((j) => j.title === jobTitle);

  useEffect(() => {
    if (selectedJobData) {
      setDepartment(selectedJobData.department);
    }
  }, [jobTitle]);

  // ─── Salary range validation ───
  const parseSalaryNumber = (val: string): number => {
    return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
  };

  const salaryNumber = parseSalaryNumber(baseSalary);
  const salaryWarning = (() => {
    if (!selectedJobData || !baseSalary || salaryNumber === 0) return null;
    if (salaryNumber < selectedJobData.salaryMin) {
      return {
        type: "under" as const,
        message: `Below the salary range for ${jobTitle}. Expected range: ${selectedJobData.salaryRange}`,
      };
    }
    if (salaryNumber > selectedJobData.salaryMax) {
      return {
        type: "over" as const,
        message: `Above the salary range for ${jobTitle}. Expected range: ${selectedJobData.salaryRange}`,
      };
    }
    return null;
  })();

  // ─── Contract End N/A toggle ───
  useEffect(() => {
    if (contractEndNA) {
      setContractEndDate("");
    }
  }, [contractEndNA]);

  const addQualification = () => {
    if (!newQualName || !newQualInstitution) return;
    setQualifications([
      ...qualifications,
      {
        id: qualIdCounter.current++,
        name: newQualName,
        institution: newQualInstitution,
        date: newQualDate,
        type: newQualType,
        fileName: newQualFile,
      },
    ]);
    setNewQualName("");
    setNewQualInstitution("");
    setNewQualDate("");
    setNewQualFile("");
  };

  const removeQualification = (id: number) => {
    setQualifications(qualifications.filter((q) => q.id !== id));
  };

  const isStep1Valid = firstName && lastName && gender && email && phone;
  const isStep2Valid = jobTitle && department && employmentType && startDate;
  const isStep3Valid = baseSalary && contractStartDate;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      case 4: return true;
      default: return true;
    }
  };

  const handleSubmit = () => {
    onSubmit({
      firstName, lastName, gender, dateOfBirth, nationality, maritalStatus, address,
      phone, email, emergencyContactName, emergencyContact,
      employeeId, jobTitle, department, employmentType, employmentStatus, supervisor, workLocation, startDate,
      contractStartDate, contractEndDate: contractEndNA ? "N/A (Permanent)" : contractEndDate,
      probationStatus, baseSalary, payFrequency,
      bonusEligible, healthInsurance, pensionContribution, lifeInsurance, profDevBudget,
      paternityMaternityDays, annualLeaveDays, sicknessAbsenceDays, bereavementDays, unpaidLeaveDays,
      workingHours, workSchedule, startTime, endTime, lunchBreak, remoteWorkPolicy, overtimeEligible, noticePeriod,
      qualifications, bankName, accountNumber, accountType, bankBranch,
    });
  };

  const labelClass = "text-[11px] uppercase tracking-wider text-slate-500 mb-1.5 block";
  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-colors placeholder:text-slate-300";
  const selectClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 transition-colors bg-white";
  const sectionHeaderClass = "text-[10px] text-purple-700 uppercase tracking-widest mb-4";
  const readOnlyInputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-500 bg-slate-50 cursor-not-allowed";

  const paternityMaternityLabel = gender === "Female" ? "Maternity Leave" : gender === "Male" ? "Paternity Leave" : "Paternity/Maternity Leave";

  function ReviewField({ label, value }: { label: string; value: string }) {
    return (
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[13px] text-slate-900">{value || "—"}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-[17px] text-slate-900">Add New Employee</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-1">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-medium transition-colors ${
                      currentStep > step.id
                        ? "bg-emerald-500 text-white"
                        : currentStep === step.id
                        ? "bg-purple-700 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentStep > step.id ? <Check size={13} /> : step.id}
                  </div>
                  <span
                    className={`text-[11px] whitespace-nowrap hidden lg:block ${
                      currentStep === step.id ? "text-purple-700 font-medium" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 ${currentStep > step.id ? "bg-emerald-300" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ─── Step 1: Personal Information ─── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <p className={sectionHeaderClass}>Basic Information</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="Enter first name" />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Enter last name" />
                  </div>
                  <div>
                    <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nationality</label>
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className={inputClass} placeholder="e.g. Ghanaian" />
                  </div>
                  <div>
                    <label className={labelClass}>Marital Status</label>
                    <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} className={selectClass}>
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className={labelClass}>Residential Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Enter full residential address" />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <p className={sectionHeaderClass}>Contact Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+233 XX XXX XXXX" />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@company.com" />
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Contact Name</label>
                    <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} className={inputClass} placeholder="Enter emergency contact name" />
                  </div>
                  <div>
                    <label className={labelClass}>Emergency Contact Number</label>
                    <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className={inputClass} placeholder="+233 XX XXX XXXX" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Employment Details ─── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <p className={sectionHeaderClass}>Employment Information</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Employee ID</label>
                    <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={inputClass} placeholder="Auto-generated or enter" />
                  </div>

                  {/* Job Title — auto-fills department */}
                  <div>
                    <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
                    <select
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select Job Title</option>
                      {JOB_TITLES_DATA.map((j) => (
                        <option key={j.title} value={j.title}>{j.title}</option>
                      ))}
                    </select>
                    {selectedJobData && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Info size={10} />
                        {selectedJobData.level} • {selectedJobData.grade} • Range: {selectedJobData.salaryRange}
                      </p>
                    )}
                  </div>

                  {/* Department — auto-filled from Job Title, read-only */}
                  <div>
                    <label className={labelClass}>Department <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={department}
                      readOnly
                      className={readOnlyInputClass}
                      placeholder="Auto-filled from Job Title"
                    />
                    {selectedJobData && (
                      <p className="text-[10px] text-emerald-500 mt-1">Auto-filled from job title</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Employment Type <span className="text-red-500">*</span></label>
                    <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className={selectClass}>
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Intern">Intern</option>
                      <option value="National Service Personnel">National Service Personnel</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Employment Status</label>
                    <select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)} className={selectClass}>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Supervisor — dropdown */}
                  <div>
                    <label className={labelClass}>Supervisor / Reports To</label>
                    <select value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className={selectClass}>
                      <option value="">Select Supervisor</option>
                      {SUPERVISORS.map((s) => (
                        <option key={s.id} value={s.name}>{s.name} — {s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Work Location</label>
                    <select value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className={selectClass}>
                      <option value="">Select Location</option>
                      <option value="Accra Office">Accra Office</option>
                      <option value="Kumasi Office">Kumasi Office</option>
                      <option value="Tamale Office">Tamale Office</option>
                      <option value="Cape Coast Office">Cape Coast Office</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 3: Contract & Compensation ─── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Contract Details */}
              <div>
                <p className={sectionHeaderClass}>Contract Details</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Contract Start Date <span className="text-red-500">*</span></label>
                    <input type="date" value={contractStartDate} onChange={(e) => setContractStartDate(e.target.value)} className={inputClass} />
                  </div>

                  {/* Contract End Date with N/A option */}
                  <div>
                    <label className={labelClass}>Contract End Date</label>
                    {contractEndNA ? (
                      <div className={`${readOnlyInputClass} flex items-center`}>
                        <span>N/A (Permanent)</span>
                      </div>
                    ) : (
                      <input type="date" value={contractEndDate} onChange={(e) => setContractEndDate(e.target.value)} className={inputClass} />
                    )}
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contractEndNA}
                        onChange={(e) => setContractEndNA(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-purple-700 focus:ring-purple-500 accent-purple-700"
                      />
                      <span className="text-[11px] text-slate-500">N/A — Permanent / Full-time employee</span>
                    </label>
                  </div>

                  <div>
                    <label className={labelClass}>Probation Status</label>
                    <select value={probationStatus} onChange={(e) => setProbationStatus(e.target.value)} className={selectClass}>
                      <option value="">Select Status</option>
                      <option value="On Probation">On Probation</option>
                      <option value="Completed">Completed</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Notice Period</label>
                    <select value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className={selectClass}>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div>
                <p className={sectionHeaderClass}>Compensation & Benefits</p>
                <div className="grid grid-cols-3 gap-4">
                  {/* Base Salary with salary range alert */}
                  <div>
                    <label className={labelClass}>Base Salary ($) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className={`${inputClass} ${salaryWarning ? (salaryWarning.type === "under" ? "border-amber-400 focus:border-amber-500" : "border-red-400 focus:border-red-500") : ""}`}
                      placeholder="e.g. 55,000"
                    />
                    {selectedJobData && !salaryWarning && baseSalary && salaryNumber > 0 && (
                      <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1">
                        <Check size={10} />
                        Within range: {selectedJobData.salaryRange}
                      </p>
                    )}
                    {salaryWarning && (
                      <div className={`mt-1.5 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg ${salaryWarning.type === "under" ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}>
                        <AlertTriangle size={12} className={`shrink-0 mt-0.5 ${salaryWarning.type === "under" ? "text-amber-500" : "text-red-500"}`} />
                        <p className={`text-[10px] leading-relaxed ${salaryWarning.type === "under" ? "text-amber-700" : "text-red-700"}`}>
                          {salaryWarning.message}
                        </p>
                      </div>
                    )}
                    {selectedJobData && !baseSalary && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Info size={10} />
                        Expected range: {selectedJobData.salaryRange}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Pay Frequency</label>
                    <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)} className={selectClass}>
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Performance Bonus Eligible</label>
                    <select value={bonusEligible} onChange={(e) => setBonusEligible(e.target.value)} className={selectClass}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Health Insurance</label>
                    <select value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} className={selectClass}>
                      <option value="Included">Included</option>
                      <option value="Not Included">Not Included</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>

                  {/* Pension Contribution — dropdown of system pension tiers */}
                  <div>
                    <label className={labelClass}>Pension Contribution</label>
                    <select value={pensionContribution} onChange={(e) => setPensionContribution(e.target.value)} className={selectClass}>
                      <option value="">Select Pension Tier</option>
                      {PENSION_TIERS.map((tier) => (
                        <option key={tier.id} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Life Insurance</label>
                    <select value={lifeInsurance} onChange={(e) => setLifeInsurance(e.target.value)} className={selectClass}>
                      <option value="Included">Included</option>
                      <option value="Not Included">Not Included</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Prof. Development Budget</label>
                    <input type="text" value={profDevBudget} onChange={(e) => setProfDevBudget(e.target.value)} className={inputClass} placeholder="e.g. GHS 5,000/year" />
                  </div>
                </div>
              </div>

              {/* Leave Entitlements */}
              <div>
                <p className={sectionHeaderClass}>Leave Entitlements</p>
                <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
                  <Info size={11} className="text-slate-400" />
                  Leave days are pre-populated based on organizational policy. Adjust if needed for this employee.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>{paternityMaternityLabel} (days)</label>
                    <input type="number" value={paternityMaternityDays} onChange={(e) => setPaternityMaternityDays(e.target.value)} className={inputClass} />
                    <p className="text-[10px] text-slate-400 mt-1">Default: 10 days</p>
                  </div>
                  <div>
                    <label className={labelClass}>Annual Leave (days)</label>
                    <input type="number" value={annualLeaveDays} onChange={(e) => setAnnualLeaveDays(e.target.value)} className={inputClass} />
                    <p className="text-[10px] text-slate-400 mt-1">Default: 22 days</p>
                  </div>
                  <div>
                    <label className={labelClass}>Sickness Absence (days)</label>
                    <input type="number" value={sicknessAbsenceDays} onChange={(e) => setSicknessAbsenceDays(e.target.value)} className={inputClass} />
                    <p className="text-[10px] text-slate-400 mt-1">Default: 15 days</p>
                  </div>
                  <div>
                    <label className={labelClass}>Bereavement (days)</label>
                    <input type="number" value={bereavementDays} onChange={(e) => setBereavementDays(e.target.value)} className={inputClass} />
                    <p className="text-[10px] text-slate-400 mt-1">Default: 5 days</p>
                  </div>
                  <div>
                    <label className={labelClass}>Unpaid Leave (days)</label>
                    <input type="number" value={unpaidLeaveDays} onChange={(e) => setUnpaidLeaveDays(e.target.value)} className={inputClass} />
                    <p className="text-[10px] text-slate-400 mt-1">Default: 30 days</p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <p className={sectionHeaderClass}>Working Hours & Schedule</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Working Hours/Week</label>
                    <input type="number" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Work Schedule</label>
                    <input type="text" value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} className={inputClass} placeholder="e.g. Monday – Friday" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Time</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Time</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Lunch Break</label>
                    <select value={lunchBreak} onChange={(e) => setLunchBreak(e.target.value)} className={selectClass}>
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Remote Work Policy</label>
                    <select value={remoteWorkPolicy} onChange={(e) => setRemoteWorkPolicy(e.target.value)} className={selectClass}>
                      <option value="">Select Policy</option>
                      <option value="Fully Remote">Fully Remote</option>
                      <option value="1 day/week">1 day/week</option>
                      <option value="2 days/week">2 days/week</option>
                      <option value="3 days/week">3 days/week</option>
                      <option value="No Remote Work">No Remote Work</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Overtime Eligible</label>
                    <select value={overtimeEligible} onChange={(e) => setOvertimeEligible(e.target.value)} className={selectClass}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 4: Qualifications & Banking ─── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Qualifications */}
              <div>
                <p className={sectionHeaderClass}>Educational Qualifications & Professional Certifications</p>
                
                {/* Added qualifications list */}
                {qualifications.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {qualifications.map((q) => (
                      <div key={q.id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${q.type === "Degree" ? "bg-purple-100" : "bg-blue-100"}`}>
                          <FileText size={14} className={q.type === "Degree" ? "text-purple-600" : "text-blue-600"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-slate-900">{q.name}</p>
                          <p className="text-[11px] text-slate-500">{q.institution} — {q.date} • {q.type}</p>
                          {q.fileName && <p className="text-[10px] text-slate-400 mt-0.5">{q.fileName}</p>}
                        </div>
                        <button onClick={() => removeQualification(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add qualification form */}
                <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                  <p className="text-[11px] text-purple-700 font-medium mb-3">Add Qualification</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Qualification Name</label>
                      <input type="text" value={newQualName} onChange={(e) => setNewQualName(e.target.value)} className={inputClass} placeholder="e.g. Bachelor's in Business Administration" />
                    </div>
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input type="text" value={newQualInstitution} onChange={(e) => setNewQualInstitution(e.target.value)} className={inputClass} placeholder="e.g. University of Ghana" />
                    </div>
                    <div>
                      <label className={labelClass}>Date Obtained</label>
                      <input type="month" value={newQualDate} onChange={(e) => setNewQualDate(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Type</label>
                      <select value={newQualType} onChange={(e) => setNewQualType(e.target.value as "Degree" | "Professional Certification")} className={selectClass}>
                        <option value="Degree">Degree</option>
                        <option value="Professional Certification">Professional Certification</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Upload Document (optional)</label>
                      <div
                        className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadCloud size={20} className="text-slate-400 mx-auto mb-1" />
                        <p className="text-[12px] text-slate-500">
                          {newQualFile ? newQualFile : "Click to upload certificate/document"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG (Max 10MB)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setNewQualFile(e.target.files[0].name);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={addQualification}
                      disabled={!newQualName || !newQualInstitution}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] text-white bg-purple-700 rounded-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Upload size={13} /> Add Qualification
                    </button>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div>
                <p className={sectionHeaderClass}>Banking Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Bank Name</label>
                    <select value={bankName} onChange={(e) => setBankName(e.target.value)} className={selectClass}>
                      <option value="">Select Bank</option>
                      <option value="Ghana Commercial Bank">Ghana Commercial Bank</option>
                      <option value="Ecobank Ghana">Ecobank Ghana</option>
                      <option value="Standard Chartered Bank">Standard Chartered Bank</option>
                      <option value="Absa Bank Ghana">Absa Bank Ghana</option>
                      <option value="Stanbic Bank Ghana">Stanbic Bank Ghana</option>
                      <option value="Fidelity Bank Ghana">Fidelity Bank Ghana</option>
                      <option value="CalBank">CalBank</option>
                      <option value="Zenith Bank Ghana">Zenith Bank Ghana</option>
                      <option value="Access Bank Ghana">Access Bank Ghana</option>
                      <option value="First National Bank Ghana">First National Bank Ghana</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Account Number</label>
                    <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={inputClass} placeholder="Enter account number" />
                  </div>
                  <div>
                    <label className={labelClass}>Account Type</label>
                    <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className={selectClass}>
                      <option value="">Select Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Branch</label>
                    <input type="text" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className={inputClass} placeholder="e.g. Accra Main Branch" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 5: Review & Submit ─── */}
          {currentStep === 5 && (
            <div className="space-y-5">
              {/* Personal Info Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className={sectionHeaderClass}>Personal Information</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  <ReviewField label="First Name" value={firstName} />
                  <ReviewField label="Last Name" value={lastName} />
                  <ReviewField label="Gender" value={gender} />
                  <ReviewField label="Date of Birth" value={dateOfBirth} />
                  <ReviewField label="Nationality" value={nationality} />
                  <ReviewField label="Marital Status" value={maritalStatus} />
                  <ReviewField label="Phone Number" value={phone} />
                  <ReviewField label="Email" value={email} />
                  <ReviewField label="Emergency Contact" value={emergencyContactName} />
                  <ReviewField label="Emergency Phone" value={emergencyContact} />
                  <div className="col-span-2">
                    <ReviewField label="Address" value={address} />
                  </div>
                </div>
              </div>

              {/* Employment Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className={sectionHeaderClass}>Employment Details</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  <ReviewField label="Employee ID" value={employeeId} />
                  <ReviewField label="Job Title" value={jobTitle} />
                  <ReviewField label="Department" value={department} />
                  <ReviewField label="Employment Type" value={employmentType} />
                  <ReviewField label="Employment Status" value={employmentStatus} />
                  <ReviewField label="Supervisor" value={supervisor} />
                  <ReviewField label="Work Location" value={workLocation} />
                  <ReviewField label="Start Date" value={startDate} />
                </div>
              </div>

              {/* Contract & Compensation Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className={sectionHeaderClass}>Contract & Compensation</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  <ReviewField label="Contract Start" value={contractStartDate} />
                  <ReviewField label="Contract End" value={contractEndNA ? "N/A (Permanent)" : contractEndDate || "—"} />
                  <ReviewField label="Probation" value={probationStatus} />
                  <ReviewField label="Notice Period" value={noticePeriod} />
                  <ReviewField label="Base Salary" value={baseSalary ? `$${baseSalary}/year` : ""} />
                  <ReviewField label="Pay Frequency" value={payFrequency} />
                  <ReviewField label="Bonus Eligible" value={bonusEligible} />
                  <ReviewField label="Health Insurance" value={healthInsurance} />
                  <ReviewField label="Pension" value={pensionContribution} />
                  <ReviewField label="Life Insurance" value={lifeInsurance} />
                </div>
              </div>

              {/* Leave Entitlements Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className={sectionHeaderClass}>Leave Entitlements</p>
                <div className="grid grid-cols-5 gap-x-6 gap-y-3">
                  <ReviewField label={paternityMaternityLabel} value={`${paternityMaternityDays} days`} />
                  <ReviewField label="Annual Leave" value={`${annualLeaveDays} days`} />
                  <ReviewField label="Sickness Absence" value={`${sicknessAbsenceDays} days`} />
                  <ReviewField label="Bereavement" value={`${bereavementDays} days`} />
                  <ReviewField label="Unpaid Leave" value={`${unpaidLeaveDays} days`} />
                </div>
              </div>

              {/* Working Hours Review */}
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className={sectionHeaderClass}>Working Hours & Schedule</p>
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  <ReviewField label="Working Hours" value={`${workingHours} hrs/week`} />
                  <ReviewField label="Schedule" value={workSchedule} />
                  <ReviewField label="Start Time" value={startTime} />
                  <ReviewField label="End Time" value={endTime} />
                </div>
              </div>

              {/* Qualifications Review */}
              {qualifications.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className={sectionHeaderClass}>Qualifications</p>
                  <div className="space-y-2">
                    {qualifications.map((q) => (
                      <div key={q.id} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${q.type === "Degree" ? "bg-purple-100" : "bg-blue-100"}`}>
                          <FileText size={12} className={q.type === "Degree" ? "text-purple-600" : "text-blue-600"} />
                        </div>
                        <div>
                          <p className="text-[12px] text-slate-900">{q.name}</p>
                          <p className="text-[10px] text-slate-500">{q.institution} — {q.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Banking Review */}
              {(bankName || accountNumber) && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className={sectionHeaderClass}>Banking Information</p>
                  <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                    <ReviewField label="Bank Name" value={bankName} />
                    <ReviewField label="Account Number" value={accountNumber ? `•••••${accountNumber.slice(-4)}` : ""} />
                    <ReviewField label="Account Type" value={accountType} />
                    <ReviewField label="Branch" value={bankBranch} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            {currentStep < STEPS.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 transition-colors"
              >
                <Check size={14} /> Add Employee
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

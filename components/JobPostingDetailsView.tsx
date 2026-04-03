import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, Briefcase, Users, DollarSign, Mail, Phone, Building2, Eye, X, FileText, ExternalLink, Linkedin, Globe, Download, CalendarCheck, UserCheck, UserX, Star, MessageSquare, CheckCircle, Video, Clock, Plus, ChevronDown, Search } from "lucide-react";

interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "Open" | "Closed" | "Draft";
  applicants: number;
  datePosted: string;
}

interface JobPostingDetailsViewProps {
  job: JobPosting;
  onBack: () => void;
}

interface ApplicantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: string;
  coverLetter: string;
  cvFileName: string;
  cvFileSize: string;
  linkedIn: string;
  portfolio: string;
  otherLinks: { label: string; url: string }[];
  education: string;
  experience: string;
  location: string;
}

// Mock applicants data
const applicantsData: ApplicantData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+233 24 123 4567",
    appliedDate: "Nov 28, 2025",
    status: "Under Review",
    coverLetter: "I am writing to express my strong interest in this position. With over 6 years of experience in project management and team leadership, I believe I would be a valuable addition to your organization. My background in strategic planning and stakeholder engagement aligns well with the requirements of this role. I am passionate about delivering impactful results and am eager to contribute to your team's success.",
    cvFileName: "Sarah_Johnson_CV.pdf",
    cvFileSize: "245 KB",
    linkedIn: "https://linkedin.com/in/sarah-johnson",
    portfolio: "https://sarahjohnson.dev",
    otherLinks: [],
    education: "MBA, University of Ghana Business School",
    experience: "6 years in Project Management",
    location: "Accra, Ghana",
  },
  {
    id: 2,
    name: "Michael Asante",
    email: "m.asante@email.com",
    phone: "+233 24 234 5678",
    appliedDate: "Nov 27, 2025",
    status: "Shortlisted",
    coverLetter: "I am excited to apply for this opportunity. Having worked in a similar capacity for the past 4 years, I have developed strong skills in data analysis, reporting, and cross-functional collaboration. I am confident that my technical expertise and leadership abilities make me an ideal candidate for this position.",
    cvFileName: "Michael_Asante_Resume.pdf",
    cvFileSize: "312 KB",
    linkedIn: "https://linkedin.com/in/michael-asante",
    portfolio: "",
    otherLinks: [{ label: "GitHub", url: "https://github.com/masante" }],
    education: "BSc Computer Science, KNUST",
    experience: "4 years in Data Analysis & M&E",
    location: "Kumasi, Ghana",
  },
  {
    id: 3,
    name: "Abena Mensah",
    email: "abena.m@email.com",
    phone: "+233 24 345 6789",
    appliedDate: "Nov 26, 2025",
    status: "Under Review",
    coverLetter: "I would like to be considered for this position. My experience in financial management and grant compliance has prepared me to handle the responsibilities outlined in this role. I am a detail-oriented professional with a strong commitment to organizational excellence and continuous improvement.",
    cvFileName: "Abena_Mensah_CV.pdf",
    cvFileSize: "198 KB",
    linkedIn: "https://linkedin.com/in/abena-mensah",
    portfolio: "https://abenamensah.com",
    otherLinks: [{ label: "Certifications", url: "https://credentials.example.com/abena" }],
    education: "BSc Accounting, University of Cape Coast",
    experience: "5 years in Finance & Accounting",
    location: "Accra, Ghana",
  },
  {
    id: 4,
    name: "Kwame Osei",
    email: "k.osei@email.com",
    phone: "+233 24 456 7890",
    appliedDate: "Nov 25, 2025",
    status: "Interview Scheduled",
    coverLetter: "Thank you for considering my application. I bring a unique combination of technical skills and leadership experience that I believe would be beneficial to your team. Over the past 7 years, I have successfully managed multiple high-profile projects and built strong relationships with stakeholders at all levels.",
    cvFileName: "Kwame_Osei_Resume.pdf",
    cvFileSize: "278 KB",
    linkedIn: "https://linkedin.com/in/kwame-osei",
    portfolio: "",
    otherLinks: [{ label: "Personal Blog", url: "https://kwameosei.blog" }, { label: "Speaker Profile", url: "https://speakerdeck.com/kosei" }],
    education: "MSc Management, Ashesi University",
    experience: "7 years in Operations & Strategy",
    location: "Tema, Ghana",
  },
];

export function JobPostingDetailsView({ job, onBack }: JobPostingDetailsViewProps) {
  const [viewApplicant, setViewApplicant] = useState<ApplicantData | null>(null);
  const [applicants, setApplicants] = useState<ApplicantData[]>(applicantsData);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionToast, setActionToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Schedule Interview state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState<"online" | "in-person">("online");
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewerSearch, setInterviewerSearch] = useState("");
  const [showInterviewerDropdown, setShowInterviewerDropdown] = useState(false);
  const [interviewNotes, setInterviewNotes] = useState("");

  const availableInterviewers = [
    { id: "int-1", name: "Dr. Nana Agyemang", role: "HR Director", department: "Human Resources" },
    { id: "int-2", name: "Emmanuel Tetteh", role: "Hiring Manager", department: "Operations" },
    { id: "int-3", name: "Priscilla Boateng", role: "Senior Recruiter", department: "Human Resources" },
    { id: "int-4", name: "James Mensah", role: "Department Head", department: "Finance" },
    { id: "int-5", name: "Ama Serwaa", role: "Team Lead", department: "Engineering" },
    { id: "int-6", name: "Kofi Adomako", role: "Project Manager", department: "Operations" },
    { id: "int-7", name: "Gifty Owusu", role: "Technical Lead", department: "IT" },
    { id: "int-8", name: "Daniel Asare", role: "HR Officer", department: "Human Resources" },
  ];

  const filteredInterviewers = availableInterviewers.filter(
    (i) =>
      !selectedInterviewers.includes(i.id) &&
      (i.name.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
        i.role.toLowerCase().includes(interviewerSearch.toLowerCase()) ||
        i.department.toLowerCase().includes(interviewerSearch.toLowerCase()))
  );

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setActionToast({ message, type });
    setTimeout(() => setActionToast(null), 3000);
  };

  const handleAction = (action: string) => {
    if (!viewApplicant) return;
    let newStatus = viewApplicant.status;
    let toastMsg = "";

    switch (action) {
      case "shortlist":
        newStatus = "Shortlisted";
        toastMsg = `${viewApplicant.name} has been shortlisted`;
        break;
      case "schedule":
        newStatus = "Interview Scheduled";
        toastMsg = `Interview scheduled for ${viewApplicant.name}`;
        break;
      case "reject":
        setShowRejectModal(true);
        return;
      case "hire":
        newStatus = "Hired";
        toastMsg = `${viewApplicant.name} has been marked as hired`;
        break;
    }

    setApplicants((prev) =>
      prev.map((a) => (a.id === viewApplicant.id ? { ...a, status: newStatus } : a))
    );
    setViewApplicant({ ...viewApplicant, status: newStatus });
    showToast(toastMsg);
  };

  const handleReject = () => {
    if (!viewApplicant) return;
    setApplicants((prev) =>
      prev.map((a) => (a.id === viewApplicant.id ? { ...a, status: "Rejected" } : a))
    );
    setViewApplicant({ ...viewApplicant, status: "Rejected" });
    showToast(`${viewApplicant.name} has been rejected`);
    setShowRejectModal(false);
    setRejectReason("");
  };

  const getStatusColor = (status: "Open" | "Closed" | "Draft") => {
    switch (status) {
      case "Open":
        return "bg-green-50 text-green-600 border-green-200";
      case "Closed":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getApplicantStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Interview Scheduled":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Under Review":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "Rejected":
        return "bg-red-50 text-red-600 border border-red-200";
      case "Hired":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back to Applicants</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Building2 size={16} />
                <span>{job.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={16} />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>Posted {job.datePosted}</span>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Applicants</p>
                  <p className="text-xl font-semibold text-slate-900">{job.applicants}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Shortlisted</p>
                  <p className="text-xl font-semibold text-slate-900">5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Interviewed</p>
                  <p className="text-xl font-semibold text-slate-900">3</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Users size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Rejected</p>
                  <p className="text-xl font-semibold text-slate-900">8</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Job Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We are seeking an experienced {job.title} to join our {job.department} team. The ideal candidate will have a proven track record of success in managing complex projects, leading cross-functional teams, and delivering results on time and within budget.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              This is a full-time position based in {job.location}, offering competitive compensation and benefits package.
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Requirements</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Bachelor's degree in a relevant field or equivalent work experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>5+ years of experience in a similar role</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Strong leadership and communication skills</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Proficiency in project management tools and methodologies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-700 mt-1">•</span>
                <span>Excellent problem-solving and analytical abilities</span>
              </li>
            </ul>
          </div>

          {/* Applicants Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">All Applicants</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600">
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Name</th>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Email</th>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Phone</th>
                  <th className="text-left px-6 py-3 text-white text-[12px] font-semibold">Applied Date</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Status</th>
                  <th className="text-center px-6 py-3 text-white text-[12px] font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((applicant, idx) => (
                  <tr key={applicant.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="px-6 py-4">
                      <p className="text-[12px] font-medium text-black">{applicant.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] text-slate-500">{applicant.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] text-slate-500">{applicant.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[12px] text-slate-500">{applicant.appliedDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${getApplicantStatusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setViewApplicant(applicant)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── View Applicant Response Modal ─────────────────────────────────── */}
      {viewApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewApplicant(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Applicant Response</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Applied on {viewApplicant.appliedDate}
                </p>
              </div>
              <button onClick={() => setViewApplicant(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Applicant Info Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-[18px] text-purple-700 font-semibold">
                      {viewApplicant.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] text-slate-900">{viewApplicant.name}</h3>
                    <p className="text-[12px] text-slate-500 mt-0.5">{viewApplicant.location}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] ${getApplicantStatusColor(viewApplicant.status)}`}>
                  {viewApplicant.status}
                </span>
              </div>

              {/* Contact & Background */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Contact & Background</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email</p>
                      <p className="text-[12px] text-slate-900">{viewApplicant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Phone</p>
                      <p className="text-[12px] text-slate-900">{viewApplicant.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Education</p>
                      <p className="text-[12px] text-slate-900">{viewApplicant.education}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={13} className="text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Experience</p>
                      <p className="text-[12px] text-slate-900">{viewApplicant.experience}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Cover Letter</p>
                <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-line">{viewApplicant.coverLetter}</p>
              </div>

              {/* CV / Resume */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">CV / Resumé</p>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <FileText size={16} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-[12px] text-slate-900">{viewApplicant.cvFileName}</p>
                      <p className="text-[10px] text-slate-400">{viewApplicant.cvFileSize}</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] text-purple-700 uppercase tracking-widest mb-3">Links & Profiles</p>
                <div className="space-y-2">
                  {viewApplicant.linkedIn && (
                    <a
                      href={viewApplicant.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                    >
                      <Linkedin size={16} className="text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-900">LinkedIn</p>
                        <p className="text-[10px] text-slate-400 truncate">{viewApplicant.linkedIn}</p>
                      </div>
                      <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                  )}
                  {viewApplicant.portfolio && (
                    <a
                      href={viewApplicant.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                    >
                      <Globe size={16} className="text-purple-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-900">Portfolio</p>
                        <p className="text-[10px] text-slate-400 truncate">{viewApplicant.portfolio}</p>
                      </div>
                      <ExternalLink size={12} className="text-slate-400 group-hover:text-purple-600 shrink-0" />
                    </a>
                  )}
                  {viewApplicant.otherLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 transition-colors group"
                    >
                      <ExternalLink size={16} className="text-emerald-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-slate-900">{link.label}</p>
                        <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                      </div>
                      <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-600 shrink-0" />
                    </a>
                  ))}
                  {!viewApplicant.linkedIn && !viewApplicant.portfolio && viewApplicant.otherLinks.length === 0 && (
                    <p className="text-[12px] text-slate-400 text-center py-3">No links provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer — Action Buttons */}
            <div className="px-6 py-4 border-t border-slate-200 shrink-0">
              {viewApplicant.status === "Hired" || viewApplicant.status === "Rejected" ? (
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    This applicant has been {viewApplicant.status === "Hired" ? "hired" : "rejected"}. No further actions available.
                  </p>
                  <button
                    onClick={() => setViewApplicant(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleAction("reject")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <UserX size={14} /> Reject
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewApplicant(null)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                    {viewApplicant.status === "Under Review" && (
                      <button
                        onClick={() => handleAction("shortlist")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Star size={14} /> Shortlist
                      </button>
                    )}
                    {(viewApplicant.status === "Under Review" || viewApplicant.status === "Shortlisted") && (
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] text-white bg-purple-700 rounded-lg hover:bg-purple-800 transition-colors"
                      >
                        <CalendarCheck size={14} /> Schedule Interview
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Reject Applicant Modal ─────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Reject Applicant</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Reject {viewApplicant?.name}
                </p>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Please provide a reason for rejecting {viewApplicant?.name}.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter rejection reason..."
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-[13px] hover:bg-red-600"
              >
                Reject Applicant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Schedule Interview Modal ─────────────────────────────────── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowScheduleModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[15px] text-slate-900">Schedule Interview</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Schedule interview for {viewApplicant?.name}
                </p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500">Date:</label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500">Time:</label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500">Mode:</label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value as "online" | "in-person")}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="in-person">In-person</option>
                  </select>
                </div>
                {interviewMode === "online" && (
                  <div className="flex items-center gap-4">
                    <label className="text-[12px] text-slate-500">Link:</label>
                    <input
                      type="text"
                      value={interviewLink}
                      onChange={(e) => setInterviewLink(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter meeting link..."
                    />
                  </div>
                )}
                {interviewMode === "in-person" && (
                  <div className="flex items-center gap-4">
                    <label className="text-[12px] text-slate-500">Location:</label>
                    <input
                      type="text"
                      value={interviewLocation}
                      onChange={(e) => setInterviewLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter meeting location..."
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500">Interviewers:</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={interviewerSearch}
                      onChange={(e) => { setInterviewerSearch(e.target.value); setShowInterviewerDropdown(true); }}
                      onFocus={() => setShowInterviewerDropdown(true)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Search interviewers..."
                    />
                    {filteredInterviewers.length > 0 && showInterviewerDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredInterviewers.map((i) => (
                          <div
                            key={i.id}
                            className="px-4 py-2 cursor-pointer hover:bg-slate-50"
                            onClick={() => {
                              setSelectedInterviewers([...selectedInterviewers, i.id]);
                              setInterviewerSearch("");
                              setShowInterviewerDropdown(false);
                            }}
                          >
                            <p className="text-[12px] text-slate-900">{i.name}</p>
                            <p className="text-[10px] text-slate-400">{i.role}, {i.department}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {selectedInterviewers.length > 0 && (
                  <div className="flex items-center gap-4">
                    <label className="text-[12px] text-slate-500">Selected Interviewers:</label>
                    <div className="flex items-center gap-2">
                      {selectedInterviewers.map((id) => {
                        const interviewer = availableInterviewers.find((i) => i.id === id);
                        return (
                          <div key={id} className="flex items-center gap-1">
                            <p className="text-[12px] text-slate-900">{interviewer?.name}</p>
                            <button
                              onClick={() => setSelectedInterviewers(selectedInterviewers.filter((i) => i !== id))}
                              className="p-1.5 hover:bg-slate-100 rounded-lg"
                            >
                              <X size={12} className="text-slate-500" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="text-[12px] text-slate-500">Notes:</label>
                  <textarea
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className="w-full h-24 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Enter any additional notes..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!viewApplicant) return;
                  setApplicants((prev) =>
                    prev.map((a) => (a.id === viewApplicant.id ? { ...a, status: "Interview Scheduled" } : a))
                  );
                  setViewApplicant({ ...viewApplicant, status: "Interview Scheduled" });
                  showToast(`Interview scheduled for ${viewApplicant.name}`);
                  setShowScheduleModal(false);
                  // Reset form
                  setInterviewDate("");
                  setInterviewTime("");
                  setInterviewMode("online");
                  setInterviewLink("");
                  setInterviewLocation("");
                  setSelectedInterviewers([]);
                  setInterviewerSearch("");
                  setInterviewNotes("");
                }}
                disabled={!interviewDate || !interviewTime || selectedInterviewers.length === 0 || (interviewMode === "online" && !interviewLink) || (interviewMode === "in-person" && !interviewLocation)}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg text-[13px] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Action Toast ─────────────────────────────────── */}
      {actionToast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
            actionToast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <p className="text-sm font-medium">{actionToast.message}</p>
        </div>
      )}
    </div>
  );
}
import { ArrowLeft, Calendar, Clock, Video, Phone, MapPin, User, Mail, FileText, CheckCircle2 } from "lucide-react";

interface Interview {
  id: number;
  candidateName: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: "Phone" | "Video" | "In-Person";
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
}

interface InterviewDetailsViewProps {
  interview: Interview;
  onBack: () => void;
}

export function InterviewDetailsView({ interview, onBack }: InterviewDetailsViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-green-50 text-green-600 border-green-200";
      case "Completed":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      case "Rescheduled":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getTypeIcon = () => {
    switch (interview.type) {
      case "Video":
        return <Video size={16} />;
      case "Phone":
        return <Phone size={16} />;
      case "In-Person":
        return <MapPin size={16} />;
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
          <span className="text-sm">Back to Interviews</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Interview with {interview.candidateName}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>{interview.position}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{interview.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{interview.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {getTypeIcon()}
                <span>{interview.type}</span>
              </div>
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium border ${getStatusColor(interview.status)}`}>
            {interview.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Candidate Information */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Candidate Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Full Name</p>
                <p className="text-sm text-slate-900 font-medium">{interview.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Email</p>
                <p className="text-sm text-slate-900">{interview.candidateName.toLowerCase().replace(' ', '.')}@email.com</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Phone</p>
                <p className="text-sm text-slate-900">+233 24 123 4567</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Applied Position</p>
                <p className="text-sm text-slate-900 font-medium">{interview.position}</p>
              </div>
            </div>
          </div>

          {/* Interview Details */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Interview Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Interviewer</p>
                <p className="text-sm text-slate-900 font-medium">{interview.interviewer}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Interview Type</p>
                <p className="text-sm text-slate-900">{interview.type}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Scheduled Date</p>
                <p className="text-sm text-slate-900">{interview.date}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Scheduled Time</p>
                <p className="text-sm text-slate-900">{interview.time}</p>
              </div>
              {interview.type === "Video" && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Meeting Link</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline">https://meet.example.com/interview-{interview.id}</a>
                </div>
              )}
              {interview.type === "In-Person" && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-600 mb-1">Location</p>
                  <p className="text-sm text-slate-900">Head Office, Conference Room B, Accra</p>
                </div>
              )}
            </div>
          </div>

          {/* Resume & Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Resume & Documents</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{interview.candidateName}_Resume.pdf</p>
                  <p className="text-xs text-slate-500">Uploaded Nov 15, 2025</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Download</button>
              </div>
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-50 rounded">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Cover_Letter.pdf</p>
                  <p className="text-xs text-slate-500">Uploaded Nov 15, 2025</p>
                </div>
                <button className="text-sm text-blue-600 hover:underline">Download</button>
              </div>
            </div>
          </div>

          {/* Interview Notes */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Interview Notes</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Pre-Interview Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Candidate has extensive experience in project management with a focus on international development projects. Strong background in stakeholder engagement and budget management.
                </p>
              </div>
              {interview.status === "Completed" && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">Post-Interview Assessment</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Communication Skills</p>
                        <p className="text-sm text-slate-600">Excellent verbal communication and presentation abilities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Technical Knowledge</p>
                        <p className="text-sm text-slate-600">Strong understanding of project management methodologies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Cultural Fit</p>
                        <p className="text-sm text-slate-600">Aligns well with organizational values and mission</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Recommendation: Proceed to next round</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

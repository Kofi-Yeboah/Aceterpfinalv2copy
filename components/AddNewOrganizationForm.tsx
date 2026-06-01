import { useState } from "react";
import {
  ArrowLeft, Building2, MapPin, Globe, Mail, Phone, FileText
} from "lucide-react";
import { cn } from "../lib/utils";

interface AddNewOrganizationFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const ORG_TYPES = ["Donor", "Government/Policymaker", "Media/Journalist", "Private Sector", "CSO/Partner"];

const SECTORS = [
  "Philanthropy",
  "International Development",
  "Multilateral Finance",
  "Government",
  "Media & Publishing",
  "Broadcasting",
  "Technology",
  "Capacity Building",
  "Agriculture",
  "Healthcare",
  "Education",
  "Energy",
  "Financial Services",
  "Consulting",
];

const LOCATIONS = [
  "Accra, Ghana",
  "Kumasi, Ghana",
  "Tamale, Ghana",
  "New York, USA",
  "Washington, USA",
  "Seattle, USA",
  "Brussels, Belgium",
  "London, UK",
  "Abidjan, Côte d'Ivoire",
  "Nairobi, Kenya",
  "Johannesburg, South Africa",
  "Addis Ababa, Ethiopia",
];


export function AddNewOrganizationForm({ onBack, onSave }: AddNewOrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sector: "",
    location: "",
    address: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    status: "Prospect",
    description: "",
  });

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isValid = formData.name.trim() && formData.type && formData.contactEmail.trim();

  const selectArrow = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23475569' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 0.75rem center",
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white";
  const selectClass = cn(inputClass, "appearance-none pr-8");
  const labelClass = "text-[11px] uppercase text-slate-500 font-medium mb-1.5 block";

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Organizations</span>
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-2xl font-semibold text-slate-900">Add New Organization</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-5 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Save Organization
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-[960px] space-y-5">

          {/* Section 1: Organization Identity */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 size={14} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Organization Identity</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className={labelClass}>
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g., Ford Foundation"
                  className={inputClass}
                />
              </div>

              {/* Type */}
              <div>
                <label className={labelClass}>
                  Organization Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ORG_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("type", type)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm border transition-colors",
                        formData.type === type
                          ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className={labelClass}>Sector / Industry</label>
                <select
                  value={formData.sector}
                  onChange={(e) => update("sector", e.target.value)}
                  className={selectClass}
                  style={selectArrow}
                >
                  <option value="">Select sector...</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Mail size={14} className="text-green-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Contact Information</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      placeholder="info@organization.org"
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => update("contactPhone", e.target.value)}
                      placeholder="+233 30 123 4567"
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className={labelClass}>Website</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="https://www.organization.org"
                    className={cn(inputClass, "pl-9")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <MapPin size={14} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Location</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City & Country</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={formData.location}
                      onChange={(e) => update("location", e.target.value)}
                      className={cn(selectClass, "pl-9")}
                      style={selectArrow}
                    >
                      <option value="">Select location...</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="e.g., 320 E 43rd St"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <FileText size={14} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Additional Information</h2>
            </div>
            <div className="px-5 py-5">
              <div>
                <label className={labelClass}>Description / Notes</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Brief description of the organization, its mission, and relevance to your work..."
                  rows={4}
                  className={cn(inputClass, "resize-none")}
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pb-4">
            <p className="text-[11px] text-slate-400">
              <span className="text-red-500">*</span> Required fields must be filled before saving
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="px-5 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Save Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  ArrowLeft, User, Building2, Mail, Phone, MapPin, Globe, Briefcase,
  Tag, MessageSquare, Users, Shield, ChevronDown, Link, BookOpen
} from "lucide-react";
import { cn } from "../lib/utils";

interface AddNewContactFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const ORGANIZATIONS = [
  "Ford Foundation",
  "Bill & Melinda Gates Foundation",
  "World Bank",
  "USAID",
  "EU Development Fund",
  "African Development Bank",
  "Ministry of Finance",
  "Ministry of Health",
  "Daily Graphic",
  "Ghana Broadcasting Corporation",
  "TechGhana Ltd",
  "WACSI",
];

const CONTACT_TYPES = [
  "Donor",
  "Government/Policymaker",
  "Media/Journalist",
  "Private Sector",
  "CSO/Partner",
];

const THEMATIC_INTERESTS = [
  "Economic Transformation",
  "Climate & Environment",
  "Digital Economy",
  "Gender & Agriculture",
  "Health",
  "Education",
  "Youth Employment",
  "Governance & Accountability",
  "Food Security",
  "Trade & Investment",
];

const LOCATIONS = [
  "West Africa / Ghana",
  "East Africa / Kenya",
  "Southern Africa / South Africa",
  "North Africa / Egypt",
  "Central Africa / Rwanda",
  "Europe / Brussels",
  "North America / USA",
  "Asia / Singapore",
];

const STAFF_MEMBERS = [
  { name: "J. Doe", role: "Director of Programs" },
  { name: "S. Amari", role: "Partnerships Manager" },
  { name: "K. Osei", role: "Communications Lead" },
  { name: "M. Johnson", role: "Finance Director" },
  { name: "A. Williams", role: "M&E Specialist" },
];

const ENGAGEMENT_STATUSES = [
  { value: "Cold (New Contact)", label: "Cold (New Contact)", color: "bg-slate-100 text-slate-600" },
  { value: "Warm Lead", label: "Warm Lead", color: "bg-amber-50 text-amber-700" },
  { value: "Active Partner", label: "Active Partner", color: "bg-green-50 text-green-700" },
  { value: "Former Partner", label: "Former Partner", color: "bg-red-50 text-red-600" },
];

const COMMUNICATION_METHODS = ["Email", "Phone", "In-Person Only", "WhatsApp"];

export function AddNewContactForm({ onBack, onSave }: AddNewContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    department: "",
    jobTitle: "",
    contactType: "",
    thematicInterests: [] as string[],
    email: "",
    phone: "",
    website: "",
    linkedIn: "",
    preferredCommunication: "Email",
    location: "",
    relationshipLead: "",
    engagementStatus: "Cold (New Contact)",
    notes: "",
  });

  const [showThematicDropdown, setShowThematicDropdown] = useState(false);

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleThematic = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      thematicInterests: prev.thematicInterests.includes(interest)
        ? prev.thematicInterests.filter((t) => t !== interest)
        : [...prev.thematicInterests, interest],
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const isValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.organization &&
    formData.contactType &&
    formData.email.trim() &&
    formData.relationshipLead;

  // Shared select arrow style
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
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Directory</span>
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-2xl font-semibold text-slate-900">Add New Contact</h1>
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
            Save Contact
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-[960px] space-y-5">

          {/* Section 1: Personal Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <User size={14} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Personal Information</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className={labelClass}>Job Title / Role</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => update("jobTitle", e.target.value)}
                  placeholder="e.g., Senior Policy Advisor"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Organization & Classification */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 size={14} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Organization & Classification</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Organization & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Organization / Affiliation <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.organization}
                    onChange={(e) => update("organization", e.target.value)}
                    className={selectClass}
                    style={selectArrow}
                  >
                    <option value="">Select organization...</option>
                    {ORGANIZATIONS.map((org) => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Department / Unit</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => update("department", e.target.value)}
                    placeholder="e.g., Finance & Grants"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Contact Type */}
              <div>
                <label className={labelClass}>
                  Contact Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("contactType", type)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm border transition-colors",
                        formData.contactType === type
                          ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thematic Interests */}
              <div>
                <label className={labelClass}>Thematic Interests</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowThematicDropdown(!showThematicDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 hover:border-slate-300 transition-colors bg-white"
                  >
                    <span className={formData.thematicInterests.length === 0 ? "text-slate-400" : "text-slate-900"}>
                      {formData.thematicInterests.length === 0
                        ? "Select thematic interests..."
                        : `${formData.thematicInterests.length} selected`}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  {showThematicDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowThematicDropdown(false)} />
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-52 overflow-y-auto">
                        {THEMATIC_INTERESTS.map((interest) => (
                          <label
                            key={interest}
                            className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.thematicInterests.includes(interest)}
                              onChange={() => toggleThematic(interest)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500/20"
                            />
                            <span className="text-sm text-slate-700">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {formData.thematicInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.thematicInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[11px] font-medium"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => toggleThematic(interest)}
                          className="ml-0.5 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">Used to match this contact with relevant policy briefs or grants</p>
              </div>
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Mail size={14} className="text-green-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Contact Details</h2>
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
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="name@organization.org"
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
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+233 30 123 4567"
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </div>
              </div>

              {/* Website & LinkedIn */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Website</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://www.example.org"
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>LinkedIn Profile</label>
                  <div className="relative">
                    <Link size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.linkedIn}
                      onChange={(e) => update("linkedIn", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className={cn(inputClass, "pl-9")}
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Communication & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preferred Communication</label>
                  <select
                    value={formData.preferredCommunication}
                    onChange={(e) => update("preferredCommunication", e.target.value)}
                    className={selectClass}
                    style={selectArrow}
                  >
                    {COMMUNICATION_METHODS.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location / Region</label>
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
              </div>
            </div>
          </div>

          {/* Section 4: Relationship Management */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Users size={14} className="text-amber-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Relationship Management</h2>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Relationship Lead & Engagement Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Relationship Lead (Owner) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.relationshipLead}
                    onChange={(e) => update("relationshipLead", e.target.value)}
                    className={selectClass}
                    style={selectArrow}
                  >
                    <option value="">Select staff member...</option>
                    {STAFF_MEMBERS.map((staff) => (
                      <option key={staff.name} value={staff.name}>
                        {staff.name} — {staff.role}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">The staff member responsible for maintaining this relationship</p>
                </div>
                <div>
                  <label className={labelClass}>Initial Engagement Status</label>
                  <div className="flex flex-wrap gap-2">
                    {ENGAGEMENT_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => update("engagementStatus", status.value)}
                        className={cn(
                          "px-3.5 py-2 rounded-lg text-sm border transition-colors",
                          formData.engagementStatus === status.value
                            ? "bg-purple-50 border-purple-300 text-purple-700 font-medium"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Notes / Background</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Enter bio, past interactions, introduction source, or any relevant context about this contact..."
                  rows={4}
                  className={cn(inputClass, "resize-none")}
                />
              </div>
            </div>
          </div>

          {/* Required Fields Note */}
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
                Save Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

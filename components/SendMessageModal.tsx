import { useState } from "react";
import svgPathsInApp from "../imports/svg-20hg5w0j6m";
import svgPathsEmail from "../imports/svg-4o3dbs2l27";
import svgPathsSMS from "../imports/svg-aty78zidxk";
import svgPathsDropdown from "../imports/svg-lp82c23a7g";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendMessageModal({ isOpen, onClose }: SendMessageModalProps) {
  const [activeTab, setActiveTab] = useState<"in-app" | "email" | "sms">("in-app");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("All Staff");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  // Mock data
  const departments = ["IT", "Finance", "HR", "Operations", "Marketing"];
  const staff = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"];

  if (!isOpen) return null;

  const getSvgPaths = () => {
    switch (activeTab) {
      case "email":
        return svgPathsEmail;
      case "sms":
        return svgPathsSMS;
      default:
        return svgPathsInApp;
    }
  };

  const svgPaths = getSvgPaths();

  const getTitle = () => {
    switch (activeTab) {
      case "email":
        return "Send Email Notifications";
      case "sms":
        return "Send SMS Notifications";
      default:
        return "Send In-App Notifications";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" onClick={onClose}>
      <div className="bg-slate-50 relative rounded-[9.551px] shrink-0 w-[550px] pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="box-border content-stretch flex flex-col gap-[19.899px] items-center overflow-visible pb-[19.899px] pt-0 px-0 relative rounded-[inherit] w-[550px]">
          {/* Header */}
          <div className="bg-white relative shrink-0 w-full">
            <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="box-border content-stretch flex gap-[7.959px] items-center justify-center px-[31.042px] py-[14.327px] relative w-full">
                <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-none relative shrink-0 text-[14.327px] text-nowrap text-slate-600 whitespace-pre">
                  {getTitle()}
                </p>
                <button
                  onClick={onClose}
                  className="absolute block cursor-pointer left-[513.39px] size-[19.103px] top-[calc(50%-0.44px)] translate-y-[-50%]"
                >
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g id="cancel">
                      <path d={svgPaths.p4bab400} fill="var(--fill-0, #94A3B8)" id="Vector" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border-[0.796px] border-[rgba(242,244,247,0)] border-solid inset-0 pointer-events-none shadow-[0px_4.776px_12.735px_-3.184px_rgba(16,24,40,0.04),0px_3.184px_4.776px_-1.592px_rgba(16,24,40,0.01)]" />
          </div>

          {/* Main Content */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[15.123px] items-center justify-center pb-[17.511px] pt-[15.919px] px-[31.838px] relative rounded-[9.551px] shrink-0 w-[510.203px] overflow-visible">
            {/* Tabs */}
            <div className="bg-slate-100 box-border content-stretch flex gap-[3.98px] items-center justify-center p-[3.184px] relative rounded-[7.959px] shrink-0">
              <button
                onClick={() => setActiveTab("sms")}
                className={`box-border content-stretch flex gap-[6.368px] items-center justify-center px-[12.735px] py-[3.98px] relative shrink-0 ${
                  activeTab === "sms"
                    ? "bg-purple-700 rounded-[6.368px]"
                    : ""
                }`}
              >
                {activeTab === "sms" && (
                  <div aria-hidden="true" className="absolute border-[0.796px] border-slate-100 border-solid inset-0 pointer-events-none rounded-[6.368px] shadow-[0px_1.592px_6.368px_0px_rgba(100,116,139,0.1)]" />
                )}
                <p className={`font-['Montserrat:${activeTab === "sms" ? "SemiBold" : "Regular"}',sans-serif] ${
                  activeTab === "sms" ? "font-semibold" : "font-normal"
                } leading-[14.327px] relative shrink-0 text-[11.143px] text-center ${
                  activeTab === "sms" ? "text-white" : "text-slate-500"
                } tracking-[-0.1114px] w-[71.635px]`}>
                  SMS
                </p>
              </button>

              <button
                onClick={() => setActiveTab("email")}
                className={`box-border content-stretch flex gap-[6.368px] items-center justify-center px-[12.735px] py-[3.98px] relative shrink-0 w-[97.106px] ${
                  activeTab === "email"
                    ? "bg-purple-700 rounded-[6.368px]"
                    : ""
                }`}
              >
                {activeTab === "email" && (
                  <div aria-hidden="true" className="absolute border-[0.796px] border-slate-100 border-solid inset-0 pointer-events-none rounded-[6.368px] shadow-[0px_1.592px_6.368px_0px_rgba(100,116,139,0.1)]" />
                )}
                <p className={`font-['Montserrat:${activeTab === "email" ? "SemiBold" : "Regular"}',sans-serif] ${
                  activeTab === "email" ? "font-semibold" : "font-normal"
                } leading-[14.327px] relative shrink-0 text-[11.143px] text-center text-nowrap ${
                  activeTab === "email" ? "text-white" : "text-slate-500"
                } tracking-[-0.1114px] whitespace-pre`}>
                  Email
                </p>
              </button>

              <button
                onClick={() => setActiveTab("in-app")}
                className={`box-border content-stretch flex gap-[6.368px] items-center justify-center px-[27.077px] py-[5.572px] relative rounded-[6.368px] shrink-0 ${
                  activeTab === "in-app"
                    ? "bg-purple-700"
                    : ""
                }`}
              >
                {activeTab === "in-app" && (
                  <div aria-hidden="true" className="absolute border-[0.796px] border-slate-100 border-solid inset-0 pointer-events-none rounded-[6.368px] shadow-[0px_1.592px_6.368px_0px_rgba(100,116,139,0.1)]" />
                )}
                <div className={`flex flex-col font-['Montserrat:${activeTab === "in-app" ? "SemiBold" : "Regular"}',sans-serif] ${
                  activeTab === "in-app" ? "font-semibold" : "font-normal"
                } justify-center leading-[0] relative shrink-0 text-[11.143px] text-center text-nowrap ${
                  activeTab === "in-app" ? "text-white" : "text-slate-500"
                } tracking-[-0.1114px]`}>
                  <p className="leading-[14.327px] whitespace-pre">In-App</p>
                </div>
              </button>
            </div>

            {/* Form Fields */}
            <div className="content-stretch flex flex-col gap-[19.899px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[19.103px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[19.103px] items-center relative shrink-0 w-full">
                  {/* Subject Field */}
                  <div className="content-stretch flex flex-col gap-[9.551px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[446.527px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[11.143px] text-nowrap text-slate-600 tracking-[-0.2229px] whitespace-pre">
                        Subject
                      </p>
                    </div>
                    <div className="bg-slate-50 relative rounded-[6.395px] shrink-0 w-full">
                      <div aria-hidden="true" className="absolute border-[0.796px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[6.395px]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-stretch flex items-center justify-between px-[9.551px] py-[5.572px] relative w-full">
                          <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Women's Fellowship Deadline"
                            className="font-['Montserrat:Regular',sans-serif] font-normal leading-[17.511px] relative shrink-0 text-[12.735px] text-slate-700 tracking-[-0.1274px] bg-transparent border-none outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="content-stretch flex flex-col gap-[9.551px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-[446.527px]">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[11.143px] text-nowrap text-slate-600 tracking-[-0.2229px] whitespace-pre">
                    Message
                  </p>
                </div>
                <div className="bg-slate-50 relative rounded-[6.395px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[0.796px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[6.395px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex items-center justify-between px-[9.551px] py-[5.572px] relative w-full">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="type message here"
                        className="basis-0 font-['Montserrat:Regular',sans-serif] font-normal grow h-[69.247px] leading-[19.103px] min-h-px min-w-px relative shrink-0 text-[12.735px] text-slate-700 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Files - Only show for Email */}
              {activeTab === "email" && (
                <div className="content-stretch flex flex-col gap-[9.551px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-[446.527px]">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[11.143px] text-nowrap text-slate-600 tracking-[-0.2229px] whitespace-pre">
                      Add Files
                    </p>
                  </div>
                  <button className="bg-blue-600 box-border content-stretch flex flex-col gap-[7.959px] items-center justify-center px-[6.368px] py-[3.98px] relative rounded-[6.368px] shrink-0">
                    <div aria-hidden="true" className="absolute border-[0.796px] border-blue-500 border-solid inset-0 pointer-events-none rounded-[6.368px]" />
                    <div className="content-stretch flex gap-[3.98px] items-center relative shrink-0 w-full">
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[17.511px] relative shrink-0 text-[11.143px] text-nowrap text-white tracking-[-0.1114px] whitespace-pre">
                        Select File
                      </p>
                      <div className="relative shrink-0 size-[15.919px]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                          <g clipPath="url(#clip0_218_63535)">
                            <path d={svgPathsEmail.p7d1f500} fill="var(--fill-0, white)" id="Vector" />
                          </g>
                          <defs>
                            <clipPath id="clip0_218_63535">
                              <rect fill="white" height="15.919" width="15.919" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Recipients Field */}
              <div className="content-stretch flex flex-col gap-[9.111px] items-start relative shrink-0 w-[446.527px]">
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                  <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[12.562px] text-nowrap text-slate-600 tracking-[-0.2512px] whitespace-pre">
                    Recipients
                  </p>
                </div>
                <div className="bg-slate-50 relative rounded-[7.209px] shrink-0 w-full cursor-pointer">
                  <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.209px]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex items-center justify-between px-[12px] py-[6.281px] relative w-full">
                      <select
                        value={recipientType}
                        onChange={(e) => {
                          setRecipientType(e.target.value);
                          setSelectedDepartments([]);
                          setSelectedStaff([]);
                        }}
                        className="font-['Montserrat:Regular',sans-serif] font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-slate-700 tracking-[-0.1436px] bg-transparent border-none outline-none w-full cursor-pointer"
                      >
                        <option value="All Staff">All Staff</option>
                        <option value="Departments">Departments</option>
                        <option value="Individual Staff">Individual Staff</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Multi-Select - Show when Departments is selected */}
              {recipientType === "Departments" && (
                <div className="content-stretch flex flex-col gap-[10.767px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-[503.357px]">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[12.562px] text-nowrap text-slate-600 tracking-[-0.2512px] whitespace-pre">
                      Select Departments
                    </p>
                  </div>
                  <div className="relative w-full">
                    <div className="bg-slate-50 relative rounded-[7.178px] shrink-0 w-full cursor-pointer" onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}>
                      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-stretch flex items-center justify-between px-[10.767px] py-[6.281px] relative w-full">
                          <div className="content-stretch flex gap-[12.562px] items-center flex-wrap">
                            {selectedDepartments.length === 0 ? (
                              <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[19.74px] text-[14.356px] text-slate-400 tracking-[-0.1436px]">
                                Select departments...
                              </p>
                            ) : (
                              selectedDepartments.map((dept) => (
                                <div key={dept} className="bg-white box-border content-stretch flex flex-col gap-[8.973px] items-start px-[7.178px] py-[6.281px] relative rounded-[7.178px] shrink-0">
                                  <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
                                  <div className="content-stretch flex gap-[14.356px] items-center relative shrink-0 w-full">
                                    <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-nowrap text-slate-700 tracking-[-0.1436px] whitespace-pre">
                                      {dept}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
                                      }}
                                      className="relative shrink-0 size-[21.534px]"
                                    >
                                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                                        <g>
                                          <path d={svgPathsDropdown.pb79c280} fill="var(--fill-0, #EF4444)" />
                                        </g>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="relative shrink-0 size-[21.534px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                              <g>
                                <path d={svgPathsDropdown.p18b38000} fill="var(--fill-0, #94A3B8)" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    {showDepartmentDropdown && (
                      <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-[100] max-h-60 overflow-y-auto">
                        {departments.map((dept) => (
                          <div
                            key={dept}
                            onClick={() => {
                              if (selectedDepartments.includes(dept)) {
                                setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
                              } else {
                                setSelectedDepartments([...selectedDepartments, dept]);
                              }
                            }}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepartments.includes(dept)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <span className="font-['Montserrat:Regular',sans-serif] text-[14.356px] text-slate-700">
                              {dept}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Individual Staff Multi-Select - Show when Individual Staff is selected */}
              {recipientType === "Individual Staff" && (
                <div className="content-stretch flex flex-col gap-[10.767px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-start justify-between relative shrink-0 w-[503.357px]">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[12.562px] text-nowrap text-slate-600 tracking-[-0.2512px] whitespace-pre">
                      Select Staff
                    </p>
                  </div>
                  <div className="relative w-full">
                    <div className="bg-slate-50 relative rounded-[7.178px] shrink-0 w-full cursor-pointer" onClick={() => setShowStaffDropdown(!showStaffDropdown)}>
                      <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-stretch flex items-center justify-between px-[10.767px] py-[6.281px] relative w-full">
                          <div className="content-stretch flex gap-[12.562px] items-center flex-wrap">
                            {selectedStaff.length === 0 ? (
                              <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[19.74px] text-[14.356px] text-slate-400 tracking-[-0.1436px]">
                                Select staff...
                              </p>
                            ) : (
                              selectedStaff.map((person) => (
                                <div key={person} className="bg-white box-border content-stretch flex flex-col gap-[8.973px] items-start px-[7.178px] py-[6.281px] relative rounded-[7.178px] shrink-0">
                                  <div aria-hidden="true" className="absolute border-[0.897px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[7.178px]" />
                                  <div className="content-stretch flex gap-[14.356px] items-center relative shrink-0 w-full">
                                    <p className="font-['Montserrat:Regular',sans-serif] font-normal leading-[19.74px] relative shrink-0 text-[14.356px] text-nowrap text-slate-700 tracking-[-0.1436px] whitespace-pre">
                                      {person}
                                    </p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStaff(selectedStaff.filter((s) => s !== person));
                                      }}
                                      className="relative shrink-0 size-[21.534px]"
                                    >
                                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                                        <g>
                                          <path d={svgPathsDropdown.pb79c280} fill="var(--fill-0, #EF4444)" />
                                        </g>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="relative shrink-0 size-[21.534px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                              <g>
                                <path d={svgPathsDropdown.p18b38000} fill="var(--fill-0, #94A3B8)" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    {showStaffDropdown && (
                      <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-[100] max-h-60 overflow-y-auto">
                        {staff.map((person) => (
                          <div
                            key={person}
                            onClick={() => {
                              if (selectedStaff.includes(person)) {
                                setSelectedStaff(selectedStaff.filter((s) => s !== person));
                              } else {
                                setSelectedStaff([...selectedStaff, person]);
                              }
                            }}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStaff.includes(person)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                            <span className="font-['Montserrat:Regular',sans-serif] text-[14.356px] text-slate-700">
                              {person}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button className="bg-purple-700 box-border content-stretch flex gap-[9.551px] items-center justify-center overflow-clip px-[12.735px] py-[7.959px] relative rounded-[6.368px] shadow-[0px_0.796px_1.592px_0px_rgba(16,24,40,0.05)] shrink-0 w-[448.119px] hover:bg-purple-800 transition-colors">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.103px] not-italic relative shrink-0 text-[12.735px] text-nowrap text-white whitespace-pre">
                Send
              </p>
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#f2f4f7] border-[0.796px] border-solid inset-0 pointer-events-none rounded-[9.551px] shadow-[0px_9.551px_12.735px_-3.184px_rgba(16,24,40,0.08),0px_3.184px_4.776px_-1.592px_rgba(16,24,40,0.03)]" />
      </div>
    </div>
  );
}
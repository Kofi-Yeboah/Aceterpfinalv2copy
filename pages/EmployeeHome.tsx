import svgPaths from "../imports/svg-tqzeldtsb3";
const imgImage3 = "https://picsum.photos/seed/1398/800/600";
const imgImage19 = "https://picsum.photos/seed/1493/800/600";
const imgImage64 = "https://picsum.photos/seed/1445/800/600";
const imgImage23 = "https://picsum.photos/seed/1449/800/600";
const imgImage65 = "https://picsum.photos/seed/1492/800/600";
const imgImage20 = "https://picsum.photos/seed/1444/800/600";
const imgImage32 = "https://picsum.photos/seed/1487/800/600";
const imgImage21 = "https://picsum.photos/seed/1491/800/600";
const imgImage24 = "https://picsum.photos/seed/1547/800/600";
const imgImage = "https://picsum.photos/seed/2201/800/600";
const imgImage1 = "https://picsum.photos/seed/1542/800/600";
const imgAvatar = "https://picsum.photos/seed/2404/800/600";
const imgAvatar1 = "https://picsum.photos/seed/1576/800/600";
import { useState } from "react";
import { CalendarOff, Plane, ReceiptText, X, Calendar, ArrowRight } from "lucide-react";

const staffOnLeave = [
  { id: 1, name: "Ama Darko", role: "HR Director", leaveType: "Annual", returnDate: "Mar 3, 2026", avatar: imgAvatar1 },
  { id: 2, name: "Kwesi Appiah", role: "M&E Manager", leaveType: "Sickness Absence", returnDate: "Feb 28, 2026", avatar: imgAvatar },
  { id: 3, name: "Abena Owusu", role: "Finance Director", leaveType: "Maternity", returnDate: "Apr 15, 2026", avatar: imgAvatar1 },
  { id: 4, name: "Daniel Quaye", role: "Finance Manager", leaveType: "Annual", returnDate: "Mar 1, 2026", avatar: imgAvatar },
  { id: 5, name: "Naomi Ansah", role: "Training Coordinator", leaveType: "Unpaid", returnDate: "Mar 10, 2026", avatar: imgAvatar1 },
  { id: 6, name: "Kofi Boateng", role: "Accountant", leaveType: "Annual", returnDate: "Mar 5, 2026", avatar: imgAvatar },
  { id: 7, name: "Efua Mensah", role: "Payroll Manager", leaveType: "Sickness Absence", returnDate: "Feb 27, 2026", avatar: imgAvatar1 },
];

const leaveTypeColors: Record<string, string> = {
  "Annual": "bg-blue-50 text-blue-700",
  "Sickness Absence": "bg-red-50 text-red-700",
  "Maternity": "bg-pink-50 text-pink-700",
  "Unpaid": "bg-amber-50 text-amber-700",
};

export function EmployeeHome() {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const previewCount = 3;

  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="max-w-[1104px] mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-9">
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[22px] text-slate-900 tracking-[-0.44px]">
            Welcome, Akwesi
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-11">
          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px] text-slate-600 mb-3">
            Quick Actions
          </p>
          <div className="grid grid-cols-3 gap-4">
            {/* Request Leave */}
            <button className="group relative bg-white rounded-[12px] border border-slate-200 px-5 py-5 flex items-center gap-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:border-purple-300 hover:shadow-[0px_4px_16px_0px_rgba(124,58,237,0.1)] transition-all duration-200 text-left">
              <div className="w-11 h-11 rounded-[10px] bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <CalendarOff size={20} className="text-purple-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] text-slate-900">
                  Request Leave
                </p>
                <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[11px] text-slate-500 mt-0.5">
                  Submit a leave application
                </p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>

            {/* Request Travel Leave */}
            <button className="group relative bg-white rounded-[12px] border border-slate-200 px-5 py-5 flex items-center gap-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:border-purple-300 hover:shadow-[0px_4px_16px_0px_rgba(124,58,237,0.1)] transition-all duration-200 text-left">
              <div className="w-11 h-11 rounded-[10px] bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <Plane size={20} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] text-slate-900">
                  Travel Request
                </p>
                <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[11px] text-slate-500 mt-0.5">
                  Plan official travel
                </p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>

            {/* Request Refund */}
            <button className="group relative bg-white rounded-[12px] border border-slate-200 px-5 py-5 flex items-center gap-4 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:border-purple-300 hover:shadow-[0px_4px_16px_0px_rgba(124,58,237,0.1)] transition-all duration-200 text-left">
              <div className="w-11 h-11 rounded-[10px] bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <ReceiptText size={20} className="text-emerald-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[14px] text-slate-900">
                  Request Refund
                </p>
                <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[11px] text-slate-500 mt-0.5">
                  Claim expense reimbursement
                </p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-[38px]">
          {/* Left Column - Blogs & News */}
          <div className="flex-1 space-y-11">
            {/* Blogs Section */}
            <div>
              <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px] text-slate-600 mb-3">
                Blogs for you
              </p>
              <div className="grid grid-cols-3 gap-[14px]">
                {/* Blog Card 1 */}
                <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="p-3">
                    <div className="h-[120.371px] relative rounded-[7px] mb-3 overflow-hidden">
                      <img alt="" className="absolute h-full left-[-15.11%] max-w-none top-0 w-[130.22%]" src={imgImage19} />
                    </div>
                    <div className="px-[7px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-slate-700 line-clamp-3 mb-[10px]">
                        The Ghana Export Promotion Authority (GEPA) in collaboration with the Hungary Export Promotion Agency (HEPA) successfully organized a business...
                      </p>
                      <div className="flex gap-[6px] items-center">
                        <div className="h-[12.171px] w-[50.713px] relative">
                          <img alt="" className="absolute h-[133.56%] left-[-36.01%] max-w-none top-0 w-[215.72%]" src={imgImage3} />
                        </div>
                        <div className="flex items-center">
                          <div className="w-0 h-[12.171px] flex items-center justify-center">
                            <div className="rotate-90 w-[12.171px] h-full">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 1">
                                <line stroke="#E2E8F0" x2="12.1707" y1="0.5" y2="0.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[10px] text-slate-400 tracking-[-0.2px]">
                          August 2, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Card 2 */}
                <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="p-3">
                    <div className="h-[120.37px] relative rounded-[7px] mb-3 overflow-hidden">
                      <img alt="" className="w-full h-full object-contain rounded-[7px]" src={imgImage23} />
                    </div>
                    <div className="px-[7px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-slate-700 line-clamp-3 mb-[10px]">
                        ACET Doubles Down on SME Growth Push for 2025
                      </p>
                      <div className="flex gap-[6px] items-center">
                        <div className="h-[8px] w-[64px] relative">
                          <img alt="" className="w-full h-full object-cover" src={imgImage64} />
                        </div>
                        <div className="flex items-center">
                          <div className="w-0 h-[12px] flex items-center justify-center">
                            <div className="rotate-90 w-[12px] h-full">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 1">
                                <line stroke="#E2E8F0" x2="12" y1="0.5" y2="0.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[10px] text-slate-400 tracking-[-0.2px]">
                          August 19, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Card 3 */}
                <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="p-3">
                    <div className="h-[120.37px] relative rounded-[7px] mb-3 overflow-hidden">
                      <img alt="" className="absolute h-[197.69%] left-[-0.56%] max-w-none top-[-37.91%] w-[102.05%]" src={imgImage20} />
                    </div>
                    <div className="px-[7px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[18px] text-[12px] text-slate-700 line-clamp-3 mb-[10px]">
                        ACET CEO criticises Africa's disjointed response to global tariff crisis
                      </p>
                      <div className="flex gap-[6px] items-center">
                        <div className="h-[12.17px] w-[28.234px] relative">
                          <img alt="" className="w-full h-full object-cover" src={imgImage65} />
                        </div>
                        <div className="flex items-center">
                          <div className="w-0 h-[12.17px] flex items-center justify-center">
                            <div className="rotate-90 w-[12.17px] h-full">
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 1">
                                <line stroke="#E2E8F0" x2="12.17" y1="0.5" y2="0.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[10px] text-slate-400 tracking-[-0.2px]">
                          June 12, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending News Section */}
            <div>
              <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px] text-slate-600 mb-3">
                Trending News
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* News Card 1 */}
                <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="p-3">
                    <div className="h-[178px] relative rounded-[7px] mb-3 overflow-hidden">
                      <img alt="" className="w-full h-full object-cover rounded-[7px]" src={imgImage21} />
                      <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[7px]" />
                      <div className="absolute left-[24.52px] top-[20px]">
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium h-[18px] leading-[16px] text-[11px] text-white tracking-[-0.22px] w-[329px] truncate">
                          Cedi Gains Must Drive Industrial Growth – ACET CEO Calls ...
                        </p>
                      </div>
                      <div className="absolute left-[161.43px] top-[80px]">
                        <div className="absolute bg-white h-[23.563px] left-[180.83px] top-[92.44px] w-[21.84px]" />
                        <div className="absolute h-[42px] left-[161.43px] top-[80px] w-[60.642px]">
                          <img alt="" className="w-full h-full object-cover" src={imgImage32} />
                        </div>
                      </div>
                    </div>
                    <div className="px-[7px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[18px] text-[14px] text-slate-700 line-clamp-2">
                        Cedi Gains Must Drive Industrial Growth – ACET CEO Calls ...
                      </p>
                    </div>
                  </div>
                </div>

                {/* News Card 2 */}
                <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="p-3">
                    <div className="h-[178px] relative rounded-[7px] mb-3 overflow-hidden">
                      <img alt="" className="w-full h-full object-cover rounded-[7px]" src={imgImage24} />
                      <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 rounded-[7px]" />
                      <div className="absolute left-[25.02px] top-[20px]">
                        <p className="font-['Montserrat:Medium',sans-serif] font-medium h-[18px] leading-[16px] text-[11px] text-white tracking-[-0.22px] w-[330px] truncate">
                          Ghana's economic growth stalled by lack of focus – ACET
                        </p>
                      </div>
                      <div className="absolute left-[161.93px] top-[80px]">
                        <div className="absolute bg-white h-[23.563px] left-[181.33px] top-[92.44px] w-[21.84px]" />
                        <div className="absolute h-[42px] left-[161.93px] top-[80px] w-[60.642px]">
                          <img alt="" className="w-full h-full object-cover" src={imgImage32} />
                        </div>
                      </div>
                    </div>
                    <div className="px-[7px]">
                      <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[18px] text-[14px] text-slate-700 line-clamp-2">
                        Ghana's economic growth stalled by lack of focus – ACET
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Ads */}
          <div className="w-[282px] flex-shrink-0">
            {/* Staff on Leave Card */}
            <div className="mb-8">
              <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px] text-slate-600 mb-3">
                Staff on Leave
              </p>
              <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-purple-600" />
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium text-[12px] text-slate-500">
                      {staffOnLeave.length} colleagues away
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-purple-100 text-purple-700 font-['Montserrat:SemiBold',sans-serif] font-semibold text-[11px]">
                    {staffOnLeave.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {staffOnLeave.slice(0, previewCount).map((person) => (
                    <div key={person.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[12px] text-slate-900 truncate">
                            {person.name}
                          </p>
                          <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[10px] text-slate-500 truncate">
                            {person.role}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-['Montserrat:Medium',sans-serif] font-medium ${leaveTypeColors[person.leaveType] || "bg-slate-100 text-slate-600"}`}>
                              {person.leaveType}
                            </span>
                            <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[10px] text-slate-400">
                              {person.returnDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {staffOnLeave.length > previewCount && (
                  <button
                    onClick={() => setShowLeaveModal(true)}
                    className="w-full px-4 py-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 hover:bg-purple-50 transition-colors group"
                  >
                    <span className="font-['Montserrat:Medium',sans-serif] font-medium text-[11px] text-purple-700 group-hover:text-purple-800">
                      View All ({staffOnLeave.length})
                    </span>
                    <ArrowRight size={12} className="text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[28px] text-[16px] text-slate-600 mb-3">
              Announcements
            </p>
            <div className="space-y-5">
              {/* Announcement Card 1 */}
              <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3">
                  <div className="h-[132.37px] relative rounded-[7px] mb-3 overflow-hidden">
                    <img alt="" className="absolute h-full left-[-1.19%] max-w-none top-0 w-[113.7%]" src={imgImage} />
                  </div>
                  <div className="px-[7px]">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[17px] text-[12px] text-slate-900 tracking-[-0.12px] line-clamp-3">
                      You can now use MTN mobile money app to pay your bills. Download it today for 500mb free data
                    </p>
                  </div>
                </div>
              </div>

              {/* Announcement Card 2 */}
              <div className="bg-white rounded-[12px] border border-slate-200 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="p-3">
                  <div className="h-[132.37px] relative rounded-[7px] mb-3 overflow-hidden">
                    <img alt="" className="w-full h-full object-cover rounded-[7px]" src={imgImage1} />
                  </div>
                  <div className="px-[7px]">
                    <p className="font-['Montserrat:Medium',sans-serif] font-medium leading-[15px] text-[12px] text-slate-900 tracking-[-0.24px] line-clamp-3">
                      Inside MAGGI Cube: What Goes In? | MAGGI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff on Leave Modal */}
      {showLeaveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLeaveModal(false)}
        >
          <div
            className="bg-white rounded-[14px] w-full max-w-[520px] max-h-[80vh] flex flex-col shadow-[0px_20px_60px_0px_rgba(0,0,0,0.15)] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-purple-50 flex items-center justify-center">
                  <Calendar size={18} className="text-purple-700" />
                </div>
                <div>
                  <h2 className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[16px] text-slate-900">
                    Staff on Leave
                  </h2>
                  <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[12px] text-slate-500">
                    {staffOnLeave.length} colleagues currently away
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {staffOnLeave.map((person) => (
                <div key={person.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-['Montserrat:SemiBold',sans-serif] font-semibold text-[13px] text-slate-900 truncate">
                          {person.name}
                        </p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-['Montserrat:Medium',sans-serif] font-medium flex-shrink-0 ${leaveTypeColors[person.leaveType] || "bg-slate-100 text-slate-600"}`}>
                          {person.leaveType}
                        </span>
                      </div>
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[11px] text-slate-500 mt-0.5">
                        {person.role}
                      </p>
                      <p className="font-['Montserrat:Regular',sans-serif] font-normal text-[11px] text-slate-400 mt-1">
                        Returns {person.returnDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
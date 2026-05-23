import { useState } from "react";
import { Search, ChevronDown, MoreHorizontal, Send, Mail, MessageSquare, Smartphone } from "lucide-react";
import svgPaths from "../imports/svg-gdqpbhw161";
import { SendMessageModal } from "./SendMessageModal";

interface Notification {
  id: string;
  type: string;
  channel: "Email" | "SMS" | "In-App";
  message: string;
  sender: string;
  senderRole: string;
  date: string;
  time: string;
  status: "read" | "unread";
  recipients: number;
}

export function NotificationCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Channels");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock notification data
  const notifications: Notification[] = [
    {
      id: "1",
      type: "Task Assignment",
      channel: "In-App",
      message: "You have been assigned to the Q4 Budget Review task",
      sender: "Sarah Johnson",
      senderRole: "Project Manager",
      date: "2025-12-02",
      time: "09:30 AM",
      status: "unread",
      recipients: 5,
    },
    {
      id: "2",
      type: "Approval Request",
      channel: "Email",
      message: "Travel request for Annual Conference requires your approval",
      sender: "Michael Chen",
      senderRole: "Travel Coordinator",
      date: "2025-12-02",
      time: "08:15 AM",
      status: "unread",
      recipients: 3,
    },
    {
      id: "3",
      type: "Project Update",
      channel: "In-App",
      message: "MEL Framework Development project timeline has been updated",
      sender: "System",
      senderRole: "System",
      date: "2025-12-01",
      time: "04:45 PM",
      status: "read",
      recipients: 12,
    },
    {
      id: "4",
      type: "Document Shared",
      channel: "Email",
      message: "New document 'Annual Report 2024' has been shared with you",
      sender: "Emily Rodriguez",
      senderRole: "Document Manager",
      date: "2025-12-01",
      time: "02:20 PM",
      status: "read",
      recipients: 8,
    },
    {
      id: "5",
      type: "Meeting Reminder",
      channel: "SMS",
      message: "Project Planning Meeting scheduled for tomorrow at 10:00 AM",
      sender: "System",
      senderRole: "System",
      date: "2025-12-01",
      time: "11:00 AM",
      status: "read",
      recipients: 15,
    },
    {
      id: "6",
      type: "System Alert",
      channel: "In-App",
      message: "Your password will expire in 7 days. Please update it.",
      sender: "System",
      senderRole: "System",
      date: "2025-11-30",
      time: "09:00 AM",
      status: "read",
      recipients: 1,
    },
    {
      id: "7",
      type: "Task Assignment",
      channel: "SMS",
      message: "New task assigned: Review stakeholder feedback document",
      sender: "David Kim",
      senderRole: "Task Manager",
      date: "2025-11-30",
      time: "03:15 PM",
      status: "read",
      recipients: 7,
    },
    {
      id: "8",
      type: "Approval Request",
      channel: "Email",
      message: "Purchase requisition #2345 awaiting your approval",
      sender: "Finance Team",
      senderRole: "Finance Team",
      date: "2025-11-29",
      time: "01:45 PM",
      status: "read",
      recipients: 4,
    },
  ];

  const notificationTypes = ["All Channels", "Email", "SMS", "In-App"];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = selectedType === "All Channels" || notification.channel === selectedType;
    return matchesSearch && matchesChannel;
  });

  const showEmptyState = filteredNotifications.length === 0 && notifications.length > 0;
  const showInitialEmptyState = notifications.length === 0;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
        <h1 className="text-2xl text-slate-900">Notification Center</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-2.5 border border-slate-200 rounded-lg bg-white shadow-sm w-56">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2.5 relative">
            <div className="relative">
              <button
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="flex items-center gap-3 px-3 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <span className="text-sm text-slate-900">{selectedType}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>

              {showTypeDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                  {notificationTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type);
                        setShowTypeDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${selectedType === type ? "text-purple-700 bg-purple-50" : "text-slate-700"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {showInitialEmptyState ? (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <svg className="w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="90" r="60" fill="#E2E8F0" />
                <path d="M75 80 Q100 60 125 80 L120 110 Q100 125 80 110 Z" fill="#94A3B8" />
              </svg>
            </div>
            <h3 className="text-slate-900 mb-2">No new notifications</h3>
            <p className="text-slate-600">You're all caught up! Check back later for updates.</p>
          </div>
        </div>
      ) : showEmptyState ? (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                <Search size={48} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-slate-900 mb-2">No notifications found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Message
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Sender
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Sender Role
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Channel
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Time
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Recipients
                </th>
                <th className="text-center px-4 py-3 text-white text-[12px] border-b border-slate-100">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 rounded-full bg-[#0B01D0] flex-shrink-0"></div>
                      )}
                      <p className={`text-[12px] ${notification.status === "unread" ? "text-slate-900" : "text-slate-700"}`}>
                        {notification.message}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-500">{notification.sender}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-500">{notification.senderRole}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap ${
                      notification.channel === "Email" ? "bg-blue-50 text-blue-700" :
                      notification.channel === "SMS" ? "bg-amber-50 text-amber-700" :
                      "bg-emerald-50 text-emerald-700"
                    }`}>
                      {notification.channel === "Email" ? <Mail size={12} /> :
                       notification.channel === "SMS" ? <Smartphone size={12} /> :
                       <MessageSquare size={12} />}
                      {notification.channel}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-700">{notification.date}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[12px] text-slate-700">{notification.time}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <p className="text-[12px] text-slate-700">{notification.recipients}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors">
                      <MoreHorizontal size={20} className="text-blue-800" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="rotate-90 text-pink-600" />
          </button>
          
          <button className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded transition-colors">
            1
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            2
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            ...
          </button>
          
          <button className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors">
            5
          </button>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-2 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
          >
            <ChevronDown size={16} className="-rotate-90 text-pink-600" />
          </button>
        </div>
      </div>

      <SendMessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
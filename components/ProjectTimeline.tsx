import { useState, useMemo, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  Filter,
  Users,
  X,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────
type ItemType = "project" | "phase" | "task";
type Status = "On Track" | "Delayed" | "Completed" | "At Risk" | "Planned";
type TimeRange = "Week" | "Month" | "Quarter" | "Year";

interface TimelineItem {
  id: string;
  name: string;
  type: ItemType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration: number; // hours
  status: Status;
  assignees?: string[];
  children?: TimelineItem[];
  isExpanded?: boolean;
  color?: string;
}

// ─── Color palette per project ──────────────────────────────────────────────────
const PROJECT_COLORS: Record<string, { bar: string; barHover: string; light: string; text: string; avatar: string }> = {
  p1: { bar: "bg-rose-400", barHover: "hover:bg-rose-500", light: "bg-rose-50", text: "text-rose-700", avatar: "bg-rose-500" },
  p2: { bar: "bg-indigo-400", barHover: "hover:bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700", avatar: "bg-indigo-500" },
  p3: { bar: "bg-amber-400", barHover: "hover:bg-amber-500", light: "bg-amber-50", text: "text-amber-700", avatar: "bg-amber-500" },
  p4: { bar: "bg-cyan-400", barHover: "hover:bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-700", avatar: "bg-cyan-500" },
  p5: { bar: "bg-emerald-400", barHover: "hover:bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700", avatar: "bg-emerald-500" },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_DATA: TimelineItem[] = [
  {
    id: "p1",
    name: "West Africa Regional Integration Study",
    type: "project",
    startDate: "2025-01-15",
    endDate: "2025-09-30",
    duration: 1200,
    status: "On Track",
    isExpanded: true,
    children: [
      {
        id: "ph1",
        name: "Procurement & Contracting",
        type: "phase",
        startDate: "2025-01-15",
        endDate: "2025-02-28",
        duration: 200,
        status: "Completed",
        isExpanded: true,
        children: [
          { id: "t1", name: "Draft Request for Proposals (RFP)", type: "task", startDate: "2025-01-15", endDate: "2025-02-15", duration: 120, status: "Completed", assignees: ["Ama Darko"] },
          { id: "t2", name: "Evaluate Vendor Submissions", type: "task", startDate: "2025-01-20", endDate: "2025-02-10", duration: 80, status: "Completed", assignees: ["Yaw Osei"] },
          { id: "t3", name: "Finalize Service Agreements", type: "task", startDate: "2025-02-01", endDate: "2025-02-28", duration: 100, status: "Completed", assignees: ["Kofi Mensah"] },
        ],
      },
      {
        id: "ph2",
        name: "Implementation",
        type: "phase",
        startDate: "2025-03-01",
        endDate: "2025-05-20",
        duration: 380,
        status: "On Track",
        isExpanded: true,
        children: [
          { id: "t4", name: "Coordinate Field Data Collection", type: "task", startDate: "2025-03-01", endDate: "2025-03-20", duration: 90, status: "Completed", assignees: ["Yaw Osei"] },
          { id: "t5", name: "Conduct Stakeholder Engagement", type: "task", startDate: "2025-03-25", endDate: "2025-05-15", duration: 200, status: "On Track", assignees: ["Kwaku Anane"] },
          { id: "t6", name: "Procure IT Equipment", type: "task", startDate: "2025-04-10", endDate: "2025-05-20", duration: 75, status: "On Track", assignees: ["Ama Darko"] },
        ],
      },
      {
        id: "ph3",
        name: "Quality Assurance",
        type: "phase",
        startDate: "2025-05-25",
        endDate: "2025-07-10",
        duration: 210,
        status: "Planned",
        isExpanded: false,
        children: [
          { id: "t7", name: "Conduct Internal Peer Review", type: "task", startDate: "2025-05-25", endDate: "2025-07-10", duration: 150, status: "Planned", assignees: ["Kofi Mensah"] },
        ],
      },
      {
        id: "ph4",
        name: "Production & Editorial",
        type: "phase",
        startDate: "2025-07-01",
        endDate: "2025-08-10",
        duration: 140,
        status: "Planned",
        isExpanded: false,
        children: [
          { id: "t8", name: "Design and Layout Report", type: "task", startDate: "2025-07-01", endDate: "2025-07-30", duration: 80, status: "Planned", assignees: ["Yaw Osei"] },
        ],
      },
      {
        id: "ph5",
        name: "Dissemination & Reporting",
        type: "phase",
        startDate: "2025-08-10",
        endDate: "2025-09-25",
        duration: 150,
        status: "Planned",
        isExpanded: false,
        children: [
          { id: "t9", name: "Plan Distribution Channels", type: "task", startDate: "2025-08-10", endDate: "2025-08-20", duration: 40, status: "Planned", assignees: ["Yaw Osei"] },
        ],
      },
      {
        id: "ph6",
        name: "Delivery Stage Complete",
        type: "phase",
        startDate: "2025-09-25",
        endDate: "2025-09-30",
        duration: 20,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
    ],
  },
  {
    id: "p2",
    name: "Healthcare System Strengthening Project",
    type: "project",
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    duration: 1600,
    status: "At Risk",
    isExpanded: true,
    children: [
      {
        id: "ph7",
        name: "Procurement & Contracting",
        type: "phase",
        startDate: "2025-02-01",
        endDate: "2025-03-15",
        duration: 160,
        status: "Delayed",
        isExpanded: false,
        children: [
          { id: "t10", name: "Vendor Selection", type: "task", startDate: "2025-02-01", endDate: "2025-02-20", duration: 80, status: "Delayed", assignees: ["Nana Yaw"] },
          { id: "t11", name: "Contract Negotiation", type: "task", startDate: "2025-02-21", endDate: "2025-03-15", duration: 80, status: "At Risk", assignees: ["Kwame Asante"] },
        ],
      },
      {
        id: "ph8",
        name: "Implementation",
        type: "phase",
        startDate: "2025-03-16",
        endDate: "2025-08-31",
        duration: 600,
        status: "Planned",
        isExpanded: false,
        children: [
          { id: "t12", name: "Deploy Medical Equipment", type: "task", startDate: "2025-03-16", endDate: "2025-06-30", duration: 350, status: "Planned", assignees: ["Ama Serwaa"] },
          { id: "t13", name: "Train Healthcare Workers", type: "task", startDate: "2025-05-01", endDate: "2025-08-31", duration: 250, status: "Planned", assignees: ["Kwesi Appiah"] },
        ],
      },
      {
        id: "ph9",
        name: "Quality Assurance",
        type: "phase",
        startDate: "2025-09-01",
        endDate: "2025-10-15",
        duration: 200,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
      {
        id: "ph10",
        name: "Reporting & Closure",
        type: "phase",
        startDate: "2025-10-16",
        endDate: "2025-11-30",
        duration: 180,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
    ],
  },
  {
    id: "p3",
    name: "Urban Infrastructure Development Plan",
    type: "project",
    startDate: "2025-03-01",
    endDate: "2026-02-28",
    duration: 2400,
    status: "On Track",
    isExpanded: false,
    children: [
      {
        id: "ph11",
        name: "Procurement & Contracting",
        type: "phase",
        startDate: "2025-03-01",
        endDate: "2025-04-30",
        duration: 300,
        status: "Completed",
        isExpanded: false,
        children: [],
      },
      {
        id: "ph12",
        name: "Implementation",
        type: "phase",
        startDate: "2025-05-01",
        endDate: "2025-12-31",
        duration: 1200,
        status: "On Track",
        isExpanded: false,
        children: [],
      },
      {
        id: "ph13",
        name: "Quality Assurance & Closure",
        type: "phase",
        startDate: "2026-01-01",
        endDate: "2026-02-28",
        duration: 400,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
    ],
  },
  {
    id: "p4",
    name: "Digital Transformation Initiative",
    type: "project",
    startDate: "2025-04-01",
    endDate: "2025-12-31",
    duration: 1800,
    status: "Planned",
    isExpanded: false,
    children: [
      {
        id: "ph14",
        name: "Planning & Design",
        type: "phase",
        startDate: "2025-04-01",
        endDate: "2025-06-30",
        duration: 500,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
      {
        id: "ph15",
        name: "Development & Testing",
        type: "phase",
        startDate: "2025-07-01",
        endDate: "2025-10-31",
        duration: 800,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
      {
        id: "ph16",
        name: "Deployment & Closure",
        type: "phase",
        startDate: "2025-11-01",
        endDate: "2025-12-31",
        duration: 500,
        status: "Planned",
        isExpanded: false,
        children: [],
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────
interface FlattenedItem extends TimelineItem {
  level: number;
  visible: boolean;
  projectId: string;
}

const flattenItems = (items: TimelineItem[], level = 0, visible = true, projectId = ""): FlattenedItem[] => {
  let result: FlattenedItem[] = [];
  for (const item of items) {
    const pid = item.type === "project" ? item.id : projectId;
    result.push({ ...item, level, visible, projectId: pid });
    if (item.children && item.children.length > 0) {
      const childrenVisible = visible && (item.isExpanded ?? false);
      result = [...result, ...flattenItems(item.children, level + 1, childrenVisible, pid)];
    }
  }
  return result;
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
};

const getStatusBadge = (status: Status) => {
  switch (status) {
    case "On Track":
      return "bg-emerald-100 text-emerald-700";
    case "Delayed":
      return "bg-red-100 text-red-700";
    case "At Risk":
      return "bg-amber-100 text-amber-700";
    case "Completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

// ─── Time column generation ─────────────────────────────────────────────────────
interface TimeColumn {
  key: string;
  label: string;
  subLabel?: string;
  startDate: Date;
  endDate: Date;
  isToday?: boolean;
  isWeekend?: boolean;
}

interface TimeGroup {
  label: string;
  columns: TimeColumn[];
}

const MOCK_TODAY = new Date("2025-05-14");

function generateTimeColumns(
  range: TimeRange,
  offset: number,
  allData: TimelineItem[]
): { groups: TimeGroup[]; columns: TimeColumn[]; totalStart: Date; totalEnd: Date; label: string } {
  const groups: TimeGroup[] = [];
  const columns: TimeColumn[] = [];
  let label = "";

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (range === "Week") {
    // Show individual days for a specific week
    const weekStart = new Date(MOCK_TODAY);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + offset * 7); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekNum = Math.ceil(((weekStart.getTime() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
    label = `Week ${weekNum} — ${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} – ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;

    const group: TimeGroup = { label: `Week ${weekNum}`, columns: [] };
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const col: TimeColumn = {
        key: date.toISOString().slice(0, 10),
        label: dayNames[date.getDay()],
        subLabel: `${date.getDate()}`,
        startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
        isToday: date.toDateString() === MOCK_TODAY.toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      };
      columns.push(col);
      group.columns.push(col);
    }
    groups.push(group);

    return { groups, columns, totalStart: weekStart, totalEnd: weekEnd, label };
  }

  if (range === "Month") {
    // Show weeks within a month
    const baseMonth = MOCK_TODAY.getMonth() + offset;
    const year = MOCK_TODAY.getFullYear() + Math.floor(baseMonth / 12);
    const month = ((baseMonth % 12) + 12) % 12;
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    label = `${monthNames[month]} ${year}`;

    // Generate day-level columns grouped by week
    let currentWeekStart = new Date(monthStart);
    let weekIdx = 1;

    while (currentWeekStart <= monthEnd) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      const actualEnd = weekEnd > monthEnd ? monthEnd : weekEnd;

      const group: TimeGroup = { label: `W${weekIdx}`, columns: [] };

      for (let d = new Date(currentWeekStart); d <= actualEnd; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        if (date.getMonth() !== month) continue;
        const col: TimeColumn = {
          key: date.toISOString().slice(0, 10),
          label: `${date.getDate()}`,
          subLabel: dayNames[date.getDay()].slice(0, 1),
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
          isToday: date.toDateString() === MOCK_TODAY.toDateString(),
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
        };
        columns.push(col);
        group.columns.push(col);
      }

      if (group.columns.length > 0) groups.push(group);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekIdx++;
    }

    return { groups, columns, totalStart: monthStart, totalEnd: monthEnd, label };
  }

  if (range === "Quarter") {
    // Show months within a quarter, each month split into weeks
    const baseQuarter = Math.floor(MOCK_TODAY.getMonth() / 3) + offset;
    const year = MOCK_TODAY.getFullYear() + Math.floor(baseQuarter / 4);
    const quarter = ((baseQuarter % 4) + 4) % 4;
    const qStartMonth = quarter * 3;

    label = `Q${quarter + 1} ${year}`;

    const qStart = new Date(year, qStartMonth, 1);
    const qEnd = new Date(year, qStartMonth + 3, 0);

    for (let m = 0; m < 3; m++) {
      const monthIdx = qStartMonth + m;
      const mStart = new Date(year, monthIdx, 1);
      const mEnd = new Date(year, monthIdx + 1, 0);
      const totalDays = mEnd.getDate();

      // Split month into ~weekly columns
      const group: TimeGroup = { label: monthNames[monthIdx], columns: [] };
      let dayStart = 1;
      let weekNum = 1;
      while (dayStart <= totalDays) {
        const dayEnd = Math.min(dayStart + 6, totalDays);
        const colStart = new Date(year, monthIdx, dayStart);
        const colEnd = new Date(year, monthIdx, dayEnd, 23, 59, 59);

        const isCurrentWeek = MOCK_TODAY >= colStart && MOCK_TODAY <= colEnd;
        const col: TimeColumn = {
          key: `${year}-${monthIdx}-w${weekNum}`,
          label: `W${weekNum}`,
          subLabel: `${dayStart}–${dayEnd}`,
          startDate: colStart,
          endDate: colEnd,
          isToday: isCurrentWeek,
        };
        columns.push(col);
        group.columns.push(col);

        dayStart = dayEnd + 1;
        weekNum++;
      }
      groups.push(group);
    }

    return { groups, columns, totalStart: qStart, totalEnd: qEnd, label };
  }

  // Year — show months
  {
    const year = MOCK_TODAY.getFullYear() + offset;
    label = `${year}`;

    const yStart = new Date(year, 0, 1);
    const yEnd = new Date(year, 11, 31);

    // Group by quarter
    for (let q = 0; q < 4; q++) {
      const group: TimeGroup = { label: `Q${q + 1}`, columns: [] };
      for (let m = q * 3; m < q * 3 + 3; m++) {
        const mStart = new Date(year, m, 1);
        const mEnd = new Date(year, m + 1, 0, 23, 59, 59);
        const isCurrentMonth = MOCK_TODAY.getMonth() === m && MOCK_TODAY.getFullYear() === year;
        const col: TimeColumn = {
          key: `${year}-${m}`,
          label: monthNames[m],
          startDate: mStart,
          endDate: mEnd,
          isToday: isCurrentMonth,
        };
        columns.push(col);
        group.columns.push(col);
      }
      groups.push(group);
    }

    return { groups, columns, totalStart: yStart, totalEnd: yEnd, label };
  }
}

// ─── Detail Panel ───────────────────────────────────────────────────────────────
function DetailPanel({ item, projectColor, onClose }: { item: FlattenedItem; projectColor: typeof PROJECT_COLORS[string]; onClose: () => void }) {
  return (
    <div className="w-[340px] border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-slate-900 truncate">{item.name}</h3>
          <p className="text-[12px] text-slate-500 mt-0.5 capitalize">{item.type}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-500">Status</span>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", item.status === "Completed" ? "bg-blue-500" : item.status === "On Track" ? "bg-emerald-500" : item.status === "Delayed" ? "bg-red-500" : item.status === "At Risk" ? "bg-amber-500" : "bg-slate-400")} />
            <span className="text-[12px] font-medium text-slate-900">{item.status}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-500">Start Date</span>
          <span className="text-[12px] font-medium text-slate-900">{formatDate(item.startDate)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-500">End Date</span>
          <span className="text-[12px] font-medium text-slate-900">{formatDate(item.endDate)}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-slate-500">Duration</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] font-medium text-slate-900">{item.duration} hrs</span>
          </div>
        </div>

        {/* Assignees */}
        {item.assignees && item.assignees.length > 0 && (
          <div>
            <span className="text-[12px] text-slate-500 block mb-2">Assignees</span>
            <div className="space-y-2">
              {item.assignees.map((name) => (
                <div key={name} className="flex items-center gap-2.5">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white", projectColor.avatar)}>
                    {getInitials(name)}
                  </div>
                  <span className="text-[12px] text-slate-800">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children count */}
        {item.children && item.children.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-slate-500">
              {item.type === "project" ? "Phases" : "Tasks"}
            </span>
            <span className="text-[12px] font-medium text-slate-900">{item.children.length}</span>
          </div>
        )}

        {/* Progress bar placeholder */}
        {item.type !== "task" && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-slate-500">Progress</span>
              <span className="text-[12px] font-medium text-slate-900">
                {item.status === "Completed" ? "100" : item.status === "On Track" ? "65" : item.status === "At Risk" ? "35" : item.status === "Delayed" ? "20" : "0"}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", projectColor.bar)}
                style={{
                  width: `${item.status === "Completed" ? 100 : item.status === "On Track" ? 65 : item.status === "At Risk" ? 35 : item.status === "Delayed" ? 20 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function ProjectTimeline() {
  const [data, setData] = useState<TimelineItem[]>(MOCK_DATA);
  const [timeRange, setTimeRange] = useState<TimeRange>("Month");
  const [timeOffset, setTimeOffset] = useState(0);
  const [activeTab, setActiveTab] = useState<"gantt" | "table">("gantt");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlattenedItem | null>(null);
  const ganttScrollRef = useRef<HTMLDivElement>(null);

  // Toggle expand/collapse
  const toggleExpand = (id: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const findAndToggle = (items: TimelineItem[]): boolean => {
      for (const item of items) {
        if (item.id === id) {
          item.isExpanded = !item.isExpanded;
          return true;
        }
        if (item.children && findAndToggle(item.children)) return true;
      }
      return false;
    };
    findAndToggle(newData);
    setData(newData);
  };

  // Filter data by selected project
  const filteredData = useMemo(() => {
    if (selectedProject === "all") return data;
    return data.filter((p) => p.id === selectedProject);
  }, [data, selectedProject]);

  const flattenedData = useMemo(() => flattenItems(filteredData), [filteredData]);
  const visibleItems = flattenedData.filter((item) => item.visible);

  // Generate time columns
  const { groups, columns, totalStart, totalEnd, label: timeLabel } = useMemo(
    () => generateTimeColumns(timeRange, timeOffset, data),
    [timeRange, timeOffset, data]
  );

  // Column widths
  const colWidth = timeRange === "Week" ? 120 : timeRange === "Month" ? 42 : timeRange === "Quarter" ? 52 : 90;
  const totalWidth = columns.length * colWidth;

  // Calculate bar position
  const getBarStyle = (startDate: string, endDate: string) => {
    const s = new Date(startDate);
    const e = new Date(endDate);

    // Clamp to visible range
    const visStart = s < totalStart ? totalStart : s;
    const visEnd = e > totalEnd ? totalEnd : e;

    if (visStart > totalEnd || visEnd < totalStart) return null; // Not visible

    const totalMs = totalEnd.getTime() - totalStart.getTime();
    if (totalMs <= 0) return null;

    const leftPct = ((visStart.getTime() - totalStart.getTime()) / totalMs) * 100;
    const widthPct = ((visEnd.getTime() - visStart.getTime()) / totalMs) * 100;

    return {
      left: `${leftPct}%`,
      width: `${Math.max(widthPct, 0.5)}%`,
    };
  };

  // Today indicator position
  const todayPosition = useMemo(() => {
    const totalMs = totalEnd.getTime() - totalStart.getTime();
    if (totalMs <= 0) return null;
    if (MOCK_TODAY < totalStart || MOCK_TODAY > totalEnd) return null;
    return ((MOCK_TODAY.getTime() - totalStart.getTime()) / totalMs) * 100;
  }, [totalStart, totalEnd]);

  const ROW_HEIGHT = 48;
  const projectNames = data.filter((d) => d.type === "project").map((d) => ({ id: d.id, name: d.name }));

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-semibold text-slate-900">Project Timelines</h1>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Project filter + Legend */}
        <div className="flex items-center gap-3">
          {/* Project filter */}
          <div className="relative">
            <button
              onClick={() => { setShowProjectDropdown(!showProjectDropdown); setShowTimeDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors bg-white text-sm"
            >
              <Filter size={14} className="text-slate-500" />
              <span className="font-medium text-slate-700 max-w-[200px] truncate">
                {selectedProject === "all" ? "All Projects" : projectNames.find((p) => p.id === selectedProject)?.name}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showProjectDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProjectDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => { setSelectedProject("all"); setShowProjectDropdown(false); }}
                    className={cn("w-full px-4 py-2.5 text-left text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2", selectedProject === "all" ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700")}
                  >
                    <Users size={14} />
                    All Projects
                    <span className="ml-auto text-[11px] text-slate-400">{projectNames.length}</span>
                  </button>
                  <div className="border-t border-slate-100" />
                  {projectNames.map((p) => {
                    const colors = PROJECT_COLORS[p.id] || PROJECT_COLORS.p1;
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProject(p.id); setShowProjectDropdown(false); }}
                        className={cn("w-full px-4 py-2.5 text-left text-[13px] hover:bg-slate-50 transition-colors flex items-center gap-2", selectedProject === p.id ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700")}
                      >
                        <div className={cn("w-3 h-3 rounded-full shrink-0", colors.bar)} />
                        <span className="truncate">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Legend */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            {(selectedProject === "all" ? projectNames : projectNames.filter((p) => p.id === selectedProject)).map((p) => {
              const colors = PROJECT_COLORS[p.id] || PROJECT_COLORS.p1;
              return (
                <Badge key={p.id} variant="outline" className="gap-1.5 text-[11px] py-0.5 border-slate-200 font-medium text-slate-600">
                  <div className={cn("w-2.5 h-2.5 rounded-full", colors.bar)} />
                  {p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Right: Time navigation + range + tabs */}
        <div className="flex items-center gap-2">
          {/* Nav arrows */}
          <button
            onClick={() => setTimeOffset((o) => o - 1)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setTimeOffset(0)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => setTimeOffset((o) => o + 1)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* Time range selector */}
          <div className="relative">
            <button
              onClick={() => { setShowTimeDropdown(!showTimeDropdown); setShowProjectDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors bg-white text-sm"
            >
              <CalendarIcon size={14} className="text-slate-500" />
              <span className="font-medium text-slate-700">{timeRange}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {showTimeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {(["Week", "Month", "Quarter", "Year"] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => { setTimeRange(range); setTimeOffset(0); setShowTimeDropdown(false); }}
                      className={cn("w-full px-4 py-2.5 text-left text-[13px] hover:bg-slate-50 transition-colors", timeRange === range ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700")}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
          <button
            onClick={() => setActiveTab("gantt")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] ${activeTab === "gantt" ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Gantt Chart
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors min-w-[120px] ${activeTab === "table" ? "bg-purple-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Timeline Table
          </button>
        </div>
        <span className="text-[13px] font-medium text-slate-600">{timeLabel}</span>
      </div>

      {/* Main Content */}
      {activeTab === "gantt" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Gantt area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Column headers */}
            <div className="border-b border-slate-200 bg-slate-50 shrink-0">
              {/* Group row */}
              <div className="flex h-[28px]">
                {groups.map((g) => (
                  <div
                    key={g.label}
                    className="text-center text-[11px] font-semibold text-slate-500 border-r border-slate-200 flex items-center justify-center"
                    style={{ width: `${g.columns.length * colWidth}px`, minWidth: `${g.columns.length * colWidth}px` }}
                  >
                    {g.label}
                  </div>
                ))}
              </div>
              {/* Individual columns */}
              <div className="flex h-[28px]">
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={cn(
                      "text-center border-r border-slate-100 flex flex-col items-center justify-center",
                      col.isToday && "bg-blue-50",
                      col.isWeekend && "bg-slate-100/60"
                    )}
                    style={{ width: `${colWidth}px`, minWidth: `${colWidth}px` }}
                  >
                    <span className={cn("text-[10px]", col.isToday ? "font-semibold text-blue-600" : "text-slate-500")}>{col.label}</span>
                    {col.subLabel && (
                      <span className={cn("text-[9px]", col.isToday ? "text-blue-500" : "text-slate-400")}>{col.subLabel}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt body */}
            <div ref={ganttScrollRef} className="flex-1 overflow-auto relative">
              <div className="relative" style={{ width: `${totalWidth}px`, minHeight: `${visibleItems.length * ROW_HEIGHT}px` }}>
                {/* Grid lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {columns.map((col, i) => (
                    <div
                      key={col.key}
                      className={cn("shrink-0 border-r h-full", col.isWeekend ? "bg-slate-50/80 border-slate-100" : "border-slate-50")}
                      style={{ width: `${colWidth}px` }}
                    />
                  ))}
                </div>

                {/* Today line */}
                {todayPosition !== null && (
                  <div
                    className="absolute top-0 bottom-0 z-20 pointer-events-none"
                    style={{ left: `${todayPosition}%` }}
                  >
                    <div className="w-px h-full bg-blue-500 opacity-60" />
                    <div className="absolute -top-0.5 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-[9px] text-white rounded-b-md font-medium shadow-sm">
                      Today
                    </div>
                  </div>
                )}

                {/* Row bars */}
                {visibleItems.map((item, rowIdx) => {
                  const barStyle = getBarStyle(item.startDate, item.endDate);
                  if (!barStyle) return (
                    <div key={item.id} className="border-b border-slate-100" style={{ height: ROW_HEIGHT }} />
                  );

                  const colors = PROJECT_COLORS[item.projectId] || PROJECT_COLORS.p1;
                  const isProject = item.type === "project";
                  const isPhase = item.type === "phase";

                  return (
                    <div
                      key={item.id}
                      className="relative border-b border-slate-100"
                      style={{ height: ROW_HEIGHT }}
                    >
                      {/* Bar */}
                      <div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all group",
                          isProject ? `${colors.bar} ${colors.barHover} shadow-sm` : isPhase ? `${colors.bar} ${colors.barHover} opacity-70` : `${colors.bar} ${colors.barHover} opacity-50`,
                          selectedItem?.id === item.id && "ring-2 ring-blue-400 ring-offset-1"
                        )}
                        style={{
                          left: barStyle.left,
                          width: barStyle.width,
                          height: isProject ? "28px" : isPhase ? "22px" : "18px",
                          minWidth: "6px",
                        }}
                        onClick={() => setSelectedItem(item)}
                      >
                        {/* Label inside bar */}
                        <div className="absolute inset-0 flex items-center px-2.5 overflow-hidden">
                          {/* Avatar for tasks */}
                          {item.assignees && item.assignees.length > 0 && (
                            <div className="flex -space-x-1 mr-1.5 shrink-0">
                              {item.assignees.slice(0, 1).map((a) => (
                                <div
                                  key={a}
                                  className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[7px] font-bold text-white border border-white/40"
                                >
                                  {getInitials(a)}
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="text-[10px] font-semibold text-white truncate">
                            {item.name}
                          </span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                          <div className="font-semibold mb-0.5">{item.name}</div>
                          <div className="text-slate-300">
                            {formatDate(item.startDate)} – {formatDate(item.endDate)} · {item.duration}hrs
                          </div>
                          <div className="text-slate-400 capitalize">{item.type} · {item.status}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedItem && (
            <DetailPanel
              item={selectedItem}
              projectColor={PROJECT_COLORS[selectedItem.projectId] || PROJECT_COLORS.p1}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </div>
      ) : (
        /* Table view */
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B01D0" }}>
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Project / Task Name</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Assignee</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">Start Date</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold">End Date</th>
                <th className="text-right px-4 py-3 text-white text-[12px] font-semibold">Duration (hrs)</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item, idx) => {
                const colors = PROJECT_COLORS[item.projectId] || PROJECT_COLORS.p1;
                return (
                  <tr key={item.id} className={cn("border-b border-slate-100 hover:bg-slate-50", idx % 2 === 1 && "bg-slate-50/50")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${item.level * 20}px` }}>
                        {item.children && item.children.length > 0 ? (
                          <button onClick={() => toggleExpand(item.id)} className="p-0.5 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                            {item.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        ) : (
                          <div className="w-[18px]" />
                        )}
                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", colors.bar, item.type !== "project" && "opacity-50")} />
                        <span className={cn("text-[12px]", item.type === "project" ? "font-semibold text-slate-900" : "text-slate-700")}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-slate-500 capitalize">{item.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      {item.assignees && item.assignees.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold text-white", colors.avatar)}>
                            {getInitials(item.assignees[0])}
                          </div>
                          <span className="text-[12px] text-slate-600">{item.assignees.join(", ")}</span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{formatDate(item.startDate)}</td>
                    <td className="px-4 py-3 text-[12px] text-slate-600">{formatDate(item.endDate)}</td>
                    <td className="px-4 py-3 text-right text-[12px] font-medium text-slate-900">{item.duration}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium", getStatusBadge(item.status))}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1 hover:bg-slate-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import { useState, useRef } from "react";
import { Plus, Upload, Trash2, Eye, Image, X, FileText, Video, Megaphone, ExternalLink, Search, ChevronDown, MoreHorizontal, Edit } from "lucide-react";

type ContentTab = "Blogs" | "Videos" | "Announcements";

interface BlogItem {
  id: number;
  title: string;
  body: string;
  thumbnail: string | null;
  status: "Published" | "Draft";
  date: string;
}

interface VideoItem {
  id: number;
  title: string;
  link: string;
  thumbnail: string | null;
  status: "Published" | "Draft";
  date: string;
}

interface AnnouncementItem {
  id: number;
  subject: string;
  thumbnail: string | null;
  status: "Published" | "Draft";
  date: string;
}

const initialBlogs: BlogItem[] = [
  { id: 1, title: "GEPA & HEPA Business Forum Highlights", body: "The Ghana Export Promotion Authority (GEPA) in collaboration with the Hungary Export Promotion Agency (HEPA) successfully organized a business forum aimed at strengthening bilateral trade relations...", thumbnail: null, status: "Published", date: "Aug 2, 2025" },
  { id: 2, title: "ACET Doubles Down on SME Growth Push for 2025", body: "In a bold move to accelerate small and medium enterprise development across Africa, ACET has announced several strategic initiatives for the coming year...", thumbnail: null, status: "Published", date: "Aug 19, 2025" },
  { id: 3, title: "ACET CEO criticises Africa's disjointed response to global tariff crisis", body: "In a recent address, the ACET CEO highlighted the need for a unified African response to emerging global trade challenges and tariff impositions...", thumbnail: null, status: "Published", date: "Jun 12, 2025" },
  { id: 4, title: "Africa's Path to Inclusive Growth – A Policy Brief", body: "This policy brief outlines key strategies for fostering inclusive economic growth across the African continent...", thumbnail: null, status: "Draft", date: "Feb 20, 2026" },
];

const initialVideos: VideoItem[] = [
  { id: 1, title: "ACET Annual Conference 2025 Keynote", link: "https://youtube.com/watch?v=example1", thumbnail: null, status: "Published", date: "Jul 15, 2025" },
  { id: 2, title: "SME Growth Stories – Ghana Edition", link: "https://youtube.com/watch?v=example2", thumbnail: null, status: "Published", date: "Sep 3, 2025" },
  { id: 3, title: "Trade Policy Workshop Recap", link: "https://youtube.com/watch?v=example3", thumbnail: null, status: "Draft", date: "Feb 10, 2026" },
];

const initialAnnouncements: AnnouncementItem[] = [
  { id: 1, subject: "MTN Mobile Money – Pay Bills & Get 500MB Free Data", thumbnail: null, status: "Published", date: "Jan 5, 2026" },
  { id: 2, subject: "Office Closure – Easter Holiday Schedule", thumbnail: null, status: "Published", date: "Feb 1, 2026" },
  { id: 3, subject: "New Staff Wellness Program Launch", thumbnail: null, status: "Draft", date: "Feb 22, 2026" },
];

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<ContentTab>("Blogs");
  const [blogs, setBlogs] = useState<BlogItem[]>(initialBlogs);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  // Blog form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogBody, setBlogBody] = useState("");
  const [blogThumbnail, setBlogThumbnail] = useState<string | null>(null);

  // Video form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);

  // Announcement form
  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementThumbnail, setAnnouncementThumbnail] = useState<string | null>(null);

  const tabs: ContentTab[] = ["Blogs", "Videos", "Announcements"];

  const tabIcons: Record<ContentTab, React.ReactNode> = {
    Blogs: <FileText size={14} />,
    Videos: <Video size={14} />,
    Announcements: <Megaphone size={14} />,
  };

  const resetForm = () => {
    setBlogTitle("");
    setBlogBody("");
    setBlogThumbnail(null);
    setVideoTitle("");
    setVideoLink("");
    setVideoThumbnail(null);
    setAnnouncementSubject("");
    setAnnouncementThumbnail(null);
    setShowForm(false);
  };

  const handleThumbnailUpload = (setter: (val: string | null) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setter(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePublish = (asDraft: boolean) => {
    const status = asDraft ? "Draft" : "Published";
    const date = "Mar 02, 2026";

    if (activeTab === "Blogs" && blogTitle.trim()) {
      setBlogs((prev) => [
        { id: Date.now(), title: blogTitle, body: blogBody, thumbnail: blogThumbnail, status, date },
        ...prev,
      ]);
    } else if (activeTab === "Videos" && videoTitle.trim() && videoLink.trim()) {
      setVideos((prev) => [
        { id: Date.now(), title: videoTitle, link: videoLink, thumbnail: videoThumbnail, status, date },
        ...prev,
      ]);
    } else if (activeTab === "Announcements" && announcementSubject.trim()) {
      setAnnouncements((prev) => [
        { id: Date.now(), subject: announcementSubject, thumbnail: announcementThumbnail, status, date },
        ...prev,
      ]);
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (activeTab === "Blogs") setBlogs((prev) => prev.filter((b) => b.id !== id));
    else if (activeTab === "Videos") setVideos((prev) => prev.filter((v) => v.id !== id));
    else setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setOpenActionMenuId(null);
  };

  const getCount = (tab: ContentTab) => {
    if (tab === "Blogs") return blogs.length;
    if (tab === "Videos") return videos.length;
    return announcements.length;
  };

  const statusColor = (status: string) =>
    status === "Published"
      ? "bg-green-50 text-green-600"
      : "bg-amber-50 text-amber-600";

  // Filter logic
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || b.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || v.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch = a.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Statuses" || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const currentItems =
    activeTab === "Blogs" ? filteredBlogs :
    activeTab === "Videos" ? filteredVideos :
    filteredAnnouncements;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
        <h1 className="text-2xl font-semibold text-slate-900">Content Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Create {activeTab === "Blogs" ? "Blog" : activeTab === "Videos" ? "Video" : "Announcement"}
          </button>
        )}
      </div>

      {/* Tabs + Filters Bar */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-3">
          {/* Tabs — pill style matching DocumentVault */}
          <div className="bg-slate-100 p-1 rounded-lg inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  resetForm();
                  setSearchQuery("");
                  setSelectedStatus("All Statuses");
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-purple-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tabIcons[tab]}
                {tab}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-500"
                  }`}
                >
                  {getCount(tab)}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Status Filter */}
          <div className="flex items-center gap-2.5">
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
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} className="text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg hover:bg-slate-50 transition-colors shadow-sm ${
                  selectedStatus !== "All Statuses"
                    ? "border-purple-300 bg-purple-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-sm text-slate-900">{selectedStatus}</span>
                <ChevronDown size={16} className="text-purple-700" />
              </button>
              {showStatusDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowStatusDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                    {["All Statuses", "Published", "Draft"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSelectedStatus(s); setShowStatusDropdown(false); }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          selectedStatus === s ? "bg-purple-50 text-purple-700" : "text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="px-6 pt-4 pb-0 bg-slate-50 shrink-0">
          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-semibold text-slate-900">
                New {activeTab === "Blogs" ? "Blog Post" : activeTab === "Videos" ? "Video" : "Announcement"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1.5">
                  Thumbnail
                </label>
                {(activeTab === "Blogs" ? blogThumbnail : activeTab === "Videos" ? videoThumbnail : announcementThumbnail) ? (
                  <div className="relative w-[200px] h-[120px] rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={(activeTab === "Blogs" ? blogThumbnail : activeTab === "Videos" ? videoThumbnail : announcementThumbnail)!}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        if (activeTab === "Blogs") setBlogThumbnail(null);
                        else if (activeTab === "Videos") setVideoThumbnail(null);
                        else setAnnouncementThumbnail(null);
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      handleThumbnailUpload(
                        activeTab === "Blogs" ? setBlogThumbnail : activeTab === "Videos" ? setVideoThumbnail : setAnnouncementThumbnail
                      )
                    }
                    className="flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-purple-400 hover:text-purple-600 transition-colors bg-white"
                  >
                    <Image size={16} />
                    <span className="text-[12px]">Upload thumbnail image</span>
                  </button>
                )}
              </div>

              {/* Blog Fields */}
              {activeTab === "Blogs" && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="Enter blog title"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Body</label>
                    <textarea
                      value={blogBody}
                      onChange={(e) => setBlogBody(e.target.value)}
                      placeholder="Write your blog content..."
                      rows={6}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none"
                    />
                  </div>
                </>
              )}

              {/* Video Fields */}
              {activeTab === "Videos" && (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Enter video title"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Video Link</label>
                    <input
                      type="url"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                    />
                  </div>
                </>
              )}

              {/* Announcement Fields */}
              {activeTab === "Announcements" && (
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={announcementSubject}
                    onChange={(e) => setAnnouncementSubject(e.target.value)}
                    placeholder="Enter announcement subject"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handlePublish(false)}
                  className="px-5 py-2 bg-purple-700 text-white rounded-lg text-[13px] font-medium hover:bg-purple-800 transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={() => handlePublish(true)}
                  className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={resetForm}
                  className="px-5 py-2 text-slate-500 text-[13px] hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead style={{ backgroundColor: "#0B01D0" }}>
            {activeTab === "Blogs" && (
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Title</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[100px]">Thumbnail</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[80px]">Action</th>
              </tr>
            )}
            {activeTab === "Videos" && (
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Title</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[100px]">Thumbnail</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Link</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[80px]">Action</th>
              </tr>
            )}
            {activeTab === "Announcements" && (
              <tr>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Subject</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[100px]">Thumbnail</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Status</th>
                <th className="text-left px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100">Date</th>
                <th className="text-center px-4 py-3 text-white text-[12px] font-semibold border-b border-slate-100 w-[80px]">Action</th>
              </tr>
            )}
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "Videos" ? 6 : 5} className="px-4 py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    {activeTab === "Blogs" ? <FileText size={20} className="text-slate-400" /> : activeTab === "Videos" ? <Video size={20} className="text-slate-400" /> : <Megaphone size={20} className="text-slate-400" />}
                  </div>
                  <p className="text-sm text-slate-400">
                    No {activeTab.toLowerCase()} found matching your filters.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedStatus("All Statuses"); }}
                    className="mt-2 text-sm text-purple-700 hover:underline"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              <>
                {activeTab === "Blogs" &&
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-[12px] font-medium text-black line-clamp-1">{blog.title}</p>
                          <p className="text-[12px] text-slate-500 line-clamp-1">{blog.body.slice(0, 80)}...</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {blog.thumbnail ? (
                          <img src={blog.thumbnail} alt="" className="w-16 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-16 h-10 rounded bg-slate-100 flex items-center justify-center">
                            <Image size={14} className="text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${statusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-500">{blog.date}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === blog.id ? null : blog.id)}
                            className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal size={20} className="text-blue-800" />
                          </button>
                          {openActionMenuId === blog.id && (
                            <>
                              <div className="fixed inset-0 z-[100]" onClick={() => setOpenActionMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 z-[101] w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Eye size={14} className="text-slate-400" /> View
                                </button>
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Edit size={14} className="text-slate-400" /> Edit
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button onClick={() => handleDelete(blog.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <Trash2 size={14} className="text-red-400" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {activeTab === "Videos" &&
                  filteredVideos.map((video) => (
                    <tr key={video.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-medium text-black line-clamp-1">{video.title}</p>
                      </td>
                      <td className="px-4 py-4">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt="" className="w-16 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-16 h-10 rounded bg-slate-100 flex items-center justify-center">
                            <Video size={14} className="text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 truncate max-w-[200px]"
                        >
                          <ExternalLink size={11} />
                          {video.link}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${statusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-500">{video.date}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === video.id + 1000 ? null : video.id + 1000)}
                            className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal size={20} className="text-blue-800" />
                          </button>
                          {openActionMenuId === video.id + 1000 && (
                            <>
                              <div className="fixed inset-0 z-[100]" onClick={() => setOpenActionMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 z-[101] w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Eye size={14} className="text-slate-400" /> View
                                </button>
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Edit size={14} className="text-slate-400" /> Edit
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button onClick={() => handleDelete(video.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <Trash2 size={14} className="text-red-400" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                {activeTab === "Announcements" &&
                  filteredAnnouncements.map((ann) => (
                    <tr key={ann.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="text-[12px] font-medium text-black line-clamp-1">{ann.subject}</p>
                      </td>
                      <td className="px-4 py-4">
                        {ann.thumbnail ? (
                          <img src={ann.thumbnail} alt="" className="w-16 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-16 h-10 rounded bg-slate-100 flex items-center justify-center">
                            <Megaphone size={14} className="text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-xl text-[12px] ${statusColor(ann.status)}`}>
                          {ann.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[12px] text-slate-500">{ann.date}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenActionMenuId(openActionMenuId === ann.id + 2000 ? null : ann.id + 2000)}
                            className="inline-flex items-center justify-center w-10 h-10 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal size={20} className="text-blue-800" />
                          </button>
                          {openActionMenuId === ann.id + 2000 && (
                            <>
                              <div className="fixed inset-0 z-[100]" onClick={() => setOpenActionMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 z-[101] w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Eye size={14} className="text-slate-400" /> View
                                </button>
                                <button onClick={() => setOpenActionMenuId(null)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                  <Edit size={14} className="text-slate-400" /> Edit
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button onClick={() => handleDelete(ann.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                  <Trash2 size={14} className="text-red-400" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Info Bar */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-400">
          Showing {currentItems.length} of {getCount(activeTab)} {activeTab.toLowerCase()}
        </span>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  X,
  Download,
  Eye,
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Grid3X3,
  List,
  Paperclip,
  ArrowLeft,
  FileSpreadsheet,
  FileImage,
  Users,
} from "lucide-react";

import {
  getProjectFolders,
  getVaultDocuments,
  getDeptFolders,
  addVaultDocument,
  addDeptFolder,
  subscribe,
  DEPT_CATEGORIES,
} from "../lib/documentVaultStore";
import type {
  FileType,
  VaultDocument,
  ProjectFolder,
  DeptFolder,
} from "../lib/documentVaultStore";

const HR_DEPT = "HR" as const;

// ── File type helpers ────────────────────────────────────────────
function getFileTypeStyle(ft: FileType): { bgFrom: string; bgTo: string; badge: string } {
  switch (ft) {
    case "PDF":  return { bgFrom: "from-red-400",    bgTo: "to-red-600",    badge: "bg-red-500"     };
    case "XLSX": return { bgFrom: "from-green-500",  bgTo: "to-green-700",  badge: "bg-green-600"   };
    case "DOCX":
    case "DOC":  return { bgFrom: "from-blue-400",   bgTo: "to-blue-600",   badge: "bg-blue-500"    };
    case "PPTX": return { bgFrom: "from-orange-400", bgTo: "to-orange-600", badge: "bg-orange-500"  };
    case "PNG":
    case "JPG":  return { bgFrom: "from-emerald-400",bgTo: "to-emerald-600",badge: "bg-emerald-500" };
    default:     return { bgFrom: "from-slate-400",  bgTo: "to-slate-600",  badge: "bg-slate-500"   };
  }
}

function getFileIcon(ft: FileType): React.ReactNode {
  switch (ft) {
    case "XLSX": return <FileSpreadsheet size={26} className="text-white" />;
    case "PNG":
    case "JPG":  return <FileImage size={26} className="text-white" />;
    default:     return <FileText size={26} className="text-white" />;
  }
}

// ── Navigation ───────────────────────────────────────────────────
type NavView =
  | { type: "folders" }
  | { type: "folder"; folderId: string; folderName: string };

interface DisplayFolder {
  id: string;
  name: string;
  fileCount: number;
  kind: "general" | "project" | "dept";
}

// ── Component ────────────────────────────────────────────────────
export function HRDocumentVault() {
  const [projectFolders, setProjectFolders] = useState<ProjectFolder[]>(getProjectFolders());
  const [documents, setDocuments] = useState<VaultDocument[]>(getVaultDocuments());
  const [deptFolders, setDeptFolders] = useState<DeptFolder[]>(getDeptFolders());

  const [navView, setNavView] = useState<NavView>({ type: "folders" });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [showUpload, setShowUpload] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    name: "",
    folderId: "",
    category: "",
    description: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create folder form
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const unsub = subscribe(() => {
      setProjectFolders(getProjectFolders());
      setDocuments(getVaultDocuments());
      setDeptFolders(getDeptFolders());
    });
    return unsub;
  }, []);

  // ── HR-only documents ──────────────────────────────────────────
  const hrDocs = documents.filter((d) => d.department === HR_DEPT);

  // ── Build folders ──────────────────────────────────────────────
  const getFolders = (): DisplayFolder[] => {
    const result: DisplayFolder[] = [];

    // General folder
    const generalDocs = hrDocs.filter((d) => d.projectId === null);
    if (generalDocs.length > 0) {
      result.push({ id: "general", name: "General", fileCount: generalDocs.length, kind: "general" });
    }

    // Dept folder IDs
    const deptFolderIds = new Set(deptFolders.filter((df) => df.department === HR_DEPT).map((df) => df.id));

    // Project folders with HR docs
    const projectIds = new Set(
      hrDocs.filter((d) => d.projectId !== null && !deptFolderIds.has(d.projectId!)).map((d) => d.projectId!)
    );
    for (const pid of projectIds) {
      const proj = projectFolders.find((f) => f.id === pid);
      if (proj) {
        result.push({ id: proj.id, name: proj.name, fileCount: hrDocs.filter((d) => d.projectId === pid).length, kind: "project" });
      }
    }

    // Custom HR dept folders (always show, even empty)
    for (const df of deptFolders.filter((f) => f.department === HR_DEPT)) {
      result.push({ id: df.id, name: df.name, fileCount: hrDocs.filter((d) => d.projectId === df.id).length, kind: "dept" });
    }

    return result;
  };

  const getDocsInFolder = (folderId: string): VaultDocument[] => {
    if (folderId === "general") return hrDocs.filter((d) => d.projectId === null);
    return hrDocs.filter((d) => d.projectId === folderId);
  };

  // ── Filtered docs (file view) ─────────────────────────────────
  const filtered = (() => {
    if (navView.type === "folders") return [];
    const docs = getDocsInFolder(navView.folderId);
    if (!searchQuery) return docs;
    const q = searchQuery.toLowerCase();
    return docs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.uploadedBy.toLowerCase().includes(q)
    );
  })();

  // ── Breadcrumb ────────────────────────────────────────────────
  const breadcrumb: { label: string; onClick?: () => void }[] = (() => {
    if (navView.type === "folders") return [{ label: "HR Documents" }];
    return [
      { label: "HR Documents", onClick: () => setNavView({ type: "folders" }) },
      { label: navView.folderName },
    ];
  })();

  // ── Upload submit ──────────────────────────────────────────────
  const handleUploadSubmit = () => {
    if (!uploadForm.name || !uploadForm.category) return;

    const folderId = uploadForm.folderId || null;
    let folderName: string | null = null;
    if (folderId) {
      const proj = projectFolders.find((f) => f.id === folderId);
      const df = deptFolders.find((f) => f.id === folderId);
      folderName = proj?.name ?? df?.name ?? null;
    }

    const rawExt = uploadFile ? (uploadFile.name.split(".").pop()?.toUpperCase() ?? "PDF") : "PDF";
    const safeExt: FileType = (
      ["PDF", "DOCX", "XLSX", "PPTX", "DOC", "PNG", "JPG"].includes(rawExt) ? rawExt : "PDF"
    ) as FileType;

    const newDoc: VaultDocument = {
      id: `d${Date.now()}`,
      name: uploadForm.name + (uploadFile ? `.${uploadFile.name.split(".").pop()}` : ".pdf"),
      fileType: safeExt,
      size: uploadFile ? `${(uploadFile.size / 1024).toFixed(0)} KB` : "---",
      uploadedBy: "Current User",
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      projectId: folderId,
      projectName: folderName,
      department: HR_DEPT,
      category: uploadForm.category,
      description: uploadForm.description,
    };

    addVaultDocument(newDoc);
    setShowUpload(false);
    setUploadForm({ name: "", folderId: "", category: "", description: "" });
    setUploadFile(null);
  };

  // ── Create folder submit ───────────────────────────────────────
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: DeptFolder = {
      id: `df${Date.now()}`,
      name: newFolderName.trim(),
      department: HR_DEPT,
      createdDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    };
    addDeptFolder(newFolder);
    setNewFolderName("");
    setShowCreateFolder(false);
  };

  // ── Download ──────────────────────────────────────────────────
  const downloadDoc = (doc: VaultDocument) => {
    const text = `Document: ${doc.name}\nCategory: ${doc.category}\nDept: ${doc.department}\nFolder: ${doc.projectName || "General"}\nUploaded By: ${doc.uploadedBy}\nDate: ${doc.uploadedDate}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Upload folder options ──────────────────────────────────────
  const getUploadFolderOptions = (): { id: string; name: string }[] => {
    const opts: { id: string; name: string }[] = [];
    // Project folders with HR docs
    const projectIds = new Set(hrDocs.filter((d) => d.projectId !== null).map((d) => d.projectId!));
    for (const pid of projectIds) {
      const proj = projectFolders.find((f) => f.id === pid);
      if (proj) opts.push({ id: proj.id, name: proj.name });
    }
    // HR dept folders
    for (const df of deptFolders.filter((f) => f.department === HR_DEPT)) {
      opts.push({ id: df.id, name: df.name });
    }
    return opts;
  };

  // ── Folder card ────────────────────────────────────────────────
  const renderFolderCard = (folder: DisplayFolder) => (
    <div
      key={folder.id}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer group flex flex-col items-center text-center"
      onClick={() => setNavView({ type: "folder", folderId: folder.id, folderName: folder.name })}
    >
      <div className="w-16 h-14 mb-3 flex items-center justify-center">
        <Folder size={48} className="text-amber-400 group-hover:text-amber-500 transition-colors" fill="currentColor" />
      </div>
      <p className="text-[12px] text-slate-800 font-medium truncate w-full group-hover:text-blue-700 transition-colors" title={folder.name}>
        {folder.name}
      </p>
      <p className="text-[10px] text-slate-400 mt-1">
        {folder.fileCount} file{folder.fileCount !== 1 ? "s" : ""}
      </p>
    </div>
  );

  // ── Doc grid card ──────────────────────────────────────────────
  const renderDocCard = (doc: VaultDocument) => {
    const ts = getFileTypeStyle(doc.fileType);
    return (
      <div
        key={doc.id}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group cursor-pointer"
        onClick={() => setPreviewDoc(doc)}
      >
        <div className={`relative h-[110px] bg-gradient-to-br ${ts.bgFrom} ${ts.bgTo} flex items-center justify-center`}>
          {getFileIcon(doc.fileType)}
          <div className="absolute inset-4 flex flex-col justify-end gap-1 opacity-10">
            <div className="h-[2px] bg-white rounded w-3/4" />
            <div className="h-[2px] bg-white rounded w-full" />
            <div className="h-[2px] bg-white rounded w-5/6" />
          </div>
          <div className={`absolute top-2 right-2 ${ts.badge} px-1.5 py-0.5 rounded text-[9px] text-white`}>
            {doc.fileType}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }} className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50 transition-colors">
              <Eye size={13} className="text-blue-700" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); downloadDoc(doc); }} className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-100 transition-colors">
              <Download size={13} className="text-slate-600" />
            </button>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[11px] text-slate-800 truncate mb-1.5 group-hover:text-blue-700 transition-colors" title={doc.name}>{doc.name}</p>
          <div className="flex items-center justify-between mb-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-green-50 text-green-700">
              <Users size={9} /> HR
            </span>
            <span className="text-[10px] text-slate-400">{doc.size}</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">{doc.category}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{doc.uploadedDate}</p>
        </div>
      </div>
    );
  };

  // ── Doc list row ───────────────────────────────────────────────
  const renderDocRow = (doc: VaultDocument) => {
    const ts = getFileTypeStyle(doc.fileType);
    return (
      <div
        key={doc.id}
        className="flex items-center px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
        onClick={() => setPreviewDoc(doc)}
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ts.bgFrom} ${ts.bgTo} flex items-center justify-center shrink-0 mr-3`}>
          <FileText size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-[12px] text-slate-800 truncate group-hover:text-blue-700">{doc.name}</p>
          <p className="text-[10px] text-slate-400">{doc.category}</p>
        </div>
        <span className="text-[11px] text-slate-500 mr-3 shrink-0 w-[140px] truncate">{doc.projectName || "General"}</span>
        <span className="text-[11px] text-slate-400 mr-3 shrink-0 w-20">{doc.uploadedBy}</span>
        <span className="text-[11px] text-slate-400 mr-3 shrink-0 w-16">{doc.size}</span>
        <span className="text-[11px] text-slate-400 mr-3 shrink-0 w-24">{doc.uploadedDate}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={(e) => { e.stopPropagation(); setPreviewDoc(doc); }} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye size={13} className="text-blue-700" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); downloadDoc(doc); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Download size={13} className="text-slate-500" />
          </button>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────
  const displayFolders = getFolders();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
            <Users size={11} className="text-green-600" />
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} />}
                <span
                  className={i === breadcrumb.length - 1 ? "text-slate-600 font-medium" : "cursor-pointer hover:text-blue-600"}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {navView.type === "folder" && (
              <button onClick={() => setNavView({ type: "folders" })} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft size={18} className="text-slate-500" />
              </button>
            )}
            <h1 className="text-[18px] font-semibold text-slate-900">HR Document Vault</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <Plus size={14} />
            New Folder
          </button>
          <button
            onClick={() => {
              // Pre-select current folder if inside one
              if (navView.type === "folder") {
                setUploadForm((prev) => ({ ...prev, folderId: navView.folderId }));
              }
              setShowUpload(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B01D0" }}
          >
            <Plus size={14} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {navView.type === "folder" ? (
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white w-72">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-[12px] text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={12} className="text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate-500">
              {filtered.length} document{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-slate-500">
            {displayFolders.length} folder{displayFolders.length !== 1 ? "s" : ""} &middot; {hrDocs.length} document{hrDocs.length !== 1 ? "s" : ""} total
          </span>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {navView.type === "folders" ? (
          displayFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FolderOpen size={40} className="text-slate-200 mb-3" />
              <p className="text-sm text-slate-400 mb-1">No folders yet</p>
              <p className="text-[11px] text-slate-400">Create a folder to organise HR documents.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayFolders.map(renderFolderCard)}
            </div>
          )
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FolderOpen size={40} className="text-slate-200 mb-3" />
            <p className="text-sm text-slate-400 mb-1">No documents found</p>
            <p className="text-[11px] text-slate-400">
              {searchQuery ? "Try a different search term." : "Upload a document to this folder."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(renderDocCard)}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center px-4 py-2 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider shrink-0">
              <div className="w-8 mr-3" />
              <div className="flex-1 mr-4">Name / Category</div>
              <div className="w-[140px] mr-3">Folder</div>
              <div className="w-20 mr-3">By</div>
              <div className="w-16 mr-3">Size</div>
              <div className="w-24 mr-3">Date</div>
              <div className="w-16" />
            </div>
            {filtered.map(renderDocRow)}
          </div>
        )}
      </div>

      {/* ── Create Folder Modal ── */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">Create New Folder</h2>
              <button onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Department</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700">HR</div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Folder Name</label>
                <input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateFolder(); }}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 rounded-lg text-[13px] text-white disabled:opacity-50 transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B01D0" }}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[600px] max-h-[85vh] overflow-auto shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-slate-900">Upload HR Document</h2>
              <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* File picker */}
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.xlsx,.pptx,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      setUploadForm((prev) => ({
                        ...prev,
                        name: prev.name || f.name.split(".").slice(0, -1).join("."),
                      }));
                    }
                  }}
                />
                {uploadFile ? (
                  <div className="flex items-center gap-2 text-[13px] text-blue-700">
                    <Paperclip size={16} />
                    <span>{uploadFile.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="ml-1 text-slate-400 hover:text-slate-600">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Paperclip size={20} className="text-slate-400 mb-2" />
                    <p className="text-[13px] text-slate-500">Click to attach a file</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PPTX, PNG, JPG</p>
                  </>
                )}
              </div>

              {/* Document Details */}
              <div>
                <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wider mb-2">Document Details</p>
                <hr className="border-slate-200 mb-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">Document Name</label>
                    <input
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter document name"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400"
                    >
                      <option value="">Select category</option>
                      {DEPT_CATEGORIES.HR.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">Folder</label>
                    <select
                      value={uploadForm.folderId}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, folderId: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400"
                    >
                      <option value="">General (no folder)</option>
                      {getUploadFolderOptions().map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500 uppercase block mb-1">Description (optional)</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this document"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] outline-none focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 rounded-lg text-[13px] bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!uploadForm.name || !uploadForm.category}
                className="px-4 py-2 rounded-lg text-[13px] text-white disabled:opacity-50 transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B01D0" }}
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail drawer ── */}
      {previewDoc && (() => {
        const ts = getFileTypeStyle(previewDoc.fileType);
        return (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewDoc(null)} />
            <div className="relative w-full max-w-sm bg-white shadow-xl flex flex-col">
              <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
                <h3 className="text-[13px] text-slate-900 font-medium">Document Details</h3>
                <button onClick={() => setPreviewDoc(null)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className={`relative h-[130px] rounded-xl bg-gradient-to-br ${ts.bgFrom} ${ts.bgTo} flex items-center justify-center mb-5`}>
                  {getFileIcon(previewDoc.fileType)}
                  <div className="absolute inset-5 flex flex-col justify-end gap-1 opacity-10">
                    <div className="h-[2px] bg-white rounded w-3/4" />
                    <div className="h-[2px] bg-white rounded w-full" />
                    <div className="h-[2px] bg-white rounded w-5/6" />
                  </div>
                  <div className={`absolute top-3 right-3 ${ts.badge} px-2 py-0.5 rounded text-[10px] text-white`}>
                    {previewDoc.fileType}
                  </div>
                </div>
                <p className="text-[13px] text-slate-900 font-medium break-all mb-1">{previewDoc.name}</p>
                <p className="text-[11px] text-slate-400 mb-5">{previewDoc.size}</p>
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: "Department", content: (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-green-50 text-green-700">
                        <Users size={9} /> HR
                      </span>
                    )},
                    { label: "Category",    content: previewDoc.category },
                    { label: "Folder",      content: previewDoc.projectName || "General" },
                    { label: "Uploaded By", content: previewDoc.uploadedBy },
                    { label: "Date",        content: previewDoc.uploadedDate },
                    ...(previewDoc.description ? [{ label: "Description", content: previewDoc.description }] : []),
                  ].map(({ label, content }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
                      {typeof content === "string" ? (
                        <p className="text-[12px] text-slate-700">{content}</p>
                      ) : content}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3.5 border-t border-slate-200 shrink-0">
                <button
                  onClick={() => downloadDoc(previewDoc)}
                  className="w-full px-4 py-2.5 text-white rounded-lg text-[12px] transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: "#0B01D0" }}
                >
                  <Download size={13} />
                  Download
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Real file selection for the procurement modules.
//
// Several screens previously "uploaded" documents by typing a filename into a
// text box, which meant nothing was attached and nothing could be opened again.
// This opens the OS file picker, validates what comes back, and hands over a
// record carrying an object URL so the document can actually be viewed and
// downloaded for the rest of the session.
// ──────────────────────────────────────────────────────────────────────────────

export interface UploadedFile {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  sizeLabel: string;
  /** Short label such as PDF / DOCX, derived from the extension. */
  type: string;
  mimeType: string;
  /** Object URL — valid for the lifetime of the page. */
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export const DEFAULT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip,.csv";
export const DEFAULT_MAX_MB = 25;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileTypeLabel(name: string): string {
  const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
  return ext.length > 5 ? "FILE" : ext;
}

export class FileValidationError extends Error {}

function validate(file: File, accept: string, maxMb: number) {
  const allowed = accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
  const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (allowed.length && !allowed.includes(ext)) {
    throw new FileValidationError(
      `"${file.name}" is a ${ext} file. Accepted formats: ${allowed.join(", ")}.`
    );
  }
  if (file.size > maxMb * 1024 * 1024) {
    throw new FileValidationError(
      `"${file.name}" is ${formatBytes(file.size)}, which exceeds the ${maxMb} MB limit.`
    );
  }
}

function toRecord(file: File, uploadedBy: string): UploadedFile {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    sizeLabel: formatBytes(file.size),
    type: fileTypeLabel(file.name),
    mimeType: file.type || "application/octet-stream",
    url: URL.createObjectURL(file),
    uploadedAt: new Date().toISOString(),
    uploadedBy,
  };
}

/**
 * Opens the file picker and resolves with the chosen files. Resolves with an
 * empty array if the user cancels; rejects with FileValidationError if a
 * selected file fails the size or format check.
 */
export function pickFiles(opts?: {
  accept?: string;
  multiple?: boolean;
  maxMb?: number;
  uploadedBy?: string;
}): Promise<UploadedFile[]> {
  const accept = opts?.accept ?? DEFAULT_ACCEPT;
  const maxMb = opts?.maxMb ?? DEFAULT_MAX_MB;
  const uploadedBy = opts?.uploadedBy ?? "Current User";

  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = opts?.multiple ?? false;
    input.style.display = "none";
    document.body.appendChild(input);

    const cleanup = () => {
      window.removeEventListener("focus", onFocus);
      input.remove();
    };

    // A cancelled picker fires no event at all, so the window regaining focus
    // with an empty input is the only cancellation signal available.
    const onFocus = () => {
      setTimeout(() => {
        if (input.files && input.files.length === 0) {
          cleanup();
          resolve([]);
        }
      }, 400);
    };

    input.addEventListener("change", () => {
      const files = Array.from(input.files ?? []);
      try {
        files.forEach((f) => validate(f, accept, maxMb));
      } catch (err) {
        cleanup();
        reject(err);
        return;
      }
      const records = files.map((f) => toRecord(f, uploadedBy));
      cleanup();
      resolve(records);
    });

    window.addEventListener("focus", onFocus);
    input.click();
  });
}

/** Validate and wrap files that arrived from a drop event. */
export function acceptDroppedFiles(
  fileList: FileList | File[],
  opts?: { accept?: string; maxMb?: number; uploadedBy?: string }
): UploadedFile[] {
  const accept = opts?.accept ?? DEFAULT_ACCEPT;
  const maxMb = opts?.maxMb ?? DEFAULT_MAX_MB;
  const files = Array.from(fileList);
  files.forEach((f) => validate(f, accept, maxMb));
  return files.map((f) => toRecord(f, opts?.uploadedBy ?? "Current User"));
}

/** Opens an uploaded document in a new tab. */
export function openFile(file: Pick<UploadedFile, "url" | "name">) {
  if (!file.url) return;
  window.open(file.url, "_blank", "noopener,noreferrer");
}

/** Triggers a download of an uploaded document. */
export function downloadFile(file: Pick<UploadedFile, "url" | "name">) {
  if (!file.url) return;
  const a = document.createElement("a");
  a.href = file.url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

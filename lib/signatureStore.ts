// Signature store — holds the current logged-in user's uploaded signature image.
// Only the authenticated user's signature is stored; no one can use another person's.

type Listener = () => void;

interface SignatureData {
  dataUrl: string;       // base64 data URL of the PNG/JPEG
  fileName: string;
  fileSize: string;
  uploadedAt: string;    // ISO date string
  employeeId: string;    // owner — always the current user
  employeeName: string;
}

// Current user constants (matches MyPersonalInformation)
const CURRENT_USER_ID = "EMP0001";
const CURRENT_USER_NAME = "Kwame Amoah";

let signature: SignatureData | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(fn => fn());
}

export function getSignature(): SignatureData | null {
  return signature;
}

export function getCurrentUserId(): string {
  return CURRENT_USER_ID;
}

export function getCurrentUserName(): string {
  return CURRENT_USER_NAME;
}

export function uploadSignature(dataUrl: string, fileName: string, fileSize: string): void {
  signature = {
    dataUrl,
    fileName,
    fileSize,
    uploadedAt: new Date().toISOString(),
    employeeId: CURRENT_USER_ID,
    employeeName: CURRENT_USER_NAME,
  };
  notify();
}

export function removeSignature(): void {
  signature = null;
  notify();
}

/** Returns true only if the requesting user matches the signature owner */
export function canUseSignature(requestingEmployeeId: string): boolean {
  if (!signature) return false;
  return signature.employeeId === requestingEmployeeId;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

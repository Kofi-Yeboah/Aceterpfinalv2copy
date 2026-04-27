// Shared store for tasks linked to project plans (Comms & Travel)
// When a task is created with plan connections, it auto-populates the respective plan tables.

export interface LinkedTaskBase {
  taskId: string;
  taskName: string;
  assignedTo: string;
  project: string;
  phase: string;
  dueDate: string;
  priority: string;
  status: string;
}

export interface LinkedCommsTask extends LinkedTaskBase {
  audiences: string[];
  channels: string[];
  description: string;
}

export interface LinkedTravelTask extends LinkedTaskBase {
  destination: string;
  departureLocation: string;
  travelPurpose: string;
  departureDate: string;
  returnDate: string;
  transportType: string;
  accommodationType: string;
  estimatedCost: number;
  notes: string;
}

// In-memory store (listeners pattern for reactivity)
type Listener = () => void;

let linkedCommsTasks: LinkedCommsTask[] = [];
let linkedTravelTasks: LinkedTravelTask[] = [];
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribeToLinkedTasks(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLinkedCommsTasks(): LinkedCommsTask[] {
  return linkedCommsTasks;
}

export function getLinkedTravelTasks(): LinkedTravelTask[] {
  return linkedTravelTasks;
}

export function addLinkedCommsTask(task: LinkedCommsTask) {
  linkedCommsTasks = [...linkedCommsTasks, task];
  notifyListeners();
}

export function updateLinkedCommsTask(task: LinkedCommsTask) {
  const idx = linkedCommsTasks.findIndex((t) => t.taskId === task.taskId);
  if (idx >= 0) {
    linkedCommsTasks = [...linkedCommsTasks];
    linkedCommsTasks[idx] = task;
  } else {
    linkedCommsTasks = [...linkedCommsTasks, task];
  }
  notifyListeners();
}

export function addLinkedTravelTask(task: LinkedTravelTask) {
  linkedTravelTasks = [...linkedTravelTasks, task];
  notifyListeners();
}

export function updateLinkedTravelTask(task: LinkedTravelTask) {
  const idx = linkedTravelTasks.findIndex((t) => t.taskId === task.taskId);
  if (idx >= 0) {
    linkedTravelTasks = [...linkedTravelTasks];
    linkedTravelTasks[idx] = task;
  } else {
    linkedTravelTasks = [...linkedTravelTasks, task];
  }
  notifyListeners();
}

export function removeLinkedCommsTask(taskId: string) {
  linkedCommsTasks = linkedCommsTasks.filter((t) => t.taskId !== taskId);
  notifyListeners();
}

export function removeLinkedTravelTask(taskId: string) {
  linkedTravelTasks = linkedTravelTasks.filter((t) => t.taskId !== taskId);
  notifyListeners();
}
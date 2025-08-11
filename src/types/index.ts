export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteData {
  content: string;
  title?: string;
}

export type UpdateNoteData = Partial<CreateNoteData>;

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: "productivity" | "scheduling" | "priority" | "wellness";
  actionable: boolean;
  confidence: number; // 0-100
  basedOn: string[]; // What data this suggestion is based on
  createdAt: string;
}

export type TaskPriority = "low" | "medium" | "high";

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  completed?: boolean;
}

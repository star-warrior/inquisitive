export interface Notebook {
  id: string;
  deviceId: string;
  createdAt: string;
  topic: string;
  level: "beginner" | "intermediate" | "hard";
  length: "short" | "medium" | "long";
}

export interface Resource {
  id: string;
  notebookId: string;
  title: string;
  url: string;
  thumbNail?: string | null;
  sourceType: "article" | "video";
  difficulty: "1" | "2" | "3" | "4" | "5";
  status: "todo" | "in_progress" | "completed" | "skipped";
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
}

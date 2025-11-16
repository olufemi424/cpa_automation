export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CPA" | "CLIENT";
  image?: string;
}

export type ClientStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED" | "COMPLETED";
export type TaskStatus = "INTAKE" | "PREPARATION" | "REVIEW" | "FILED" | "INVOICED";
export type EntityType = "INDIVIDUAL" | "LLC" | "S_CORP" | "C_CORP" | "PARTNERSHIP" | "TRUST" | "OTHER";
export type DocumentType = "W2" | "1099_MISC" | "1099_NEC" | "1099_INT" | "1099_DIV" | "SCHEDULE_C" | "RECEIPT" | "INVOICE" | "STATEMENT" | "ID" | "OTHER";

export interface Client {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  entityType: EntityType;
  taxYear: number;
  status: ClientStatus;
  assignedToId?: string;
  assignedTo?: User;
  businessName?: string;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  clientId: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
  documentType: DocumentType;
  isVerified: boolean;
  uploadedAt: Date;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedToId?: string;
  assignedTo?: User;
  dueDate?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  clientId: string;
  senderId?: string;
  sender?: User;
  senderType: "USER" | "AI" | "SYSTEM";
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

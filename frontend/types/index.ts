export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type FilterStatus = "all" | TaskStatus;

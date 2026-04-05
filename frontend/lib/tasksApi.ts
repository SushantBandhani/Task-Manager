import api from "./api";
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  FilterStatus,
} from "@/types";

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ApiWrapper<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}

export const tasksApi = {
  getAll: async (params?: {
    status?: FilterStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<TasksResponse> => {
    const query: Record<string, string | number> = {};

    if (params?.status && params.status !== "all") query.status = params.status;
    if (params?.search) query.search = params.search;
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;

    const res = await api.get<ApiWrapper<TasksResponse>>("/tasks", { params: query });

    return res.data.data as TasksResponse;
  },

  getOne: async (id: number): Promise<Task> => {
    const res = await api.get<ApiWrapper<Task>>(`/tasks/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const res = await api.post<ApiWrapper<{task:Task}>>("/tasks", payload);
    return res.data.data.task;
  },

  update: async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const res = await api.put<ApiWrapper<Task>>(`/tasks/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  toggleStatus: async (task: Task): Promise<Task> => {
    const nextStatus =
      task.status === "completed"
        ? "pending"
        : task.status === "pending"
        ? "in_progress"
        : "completed";
    const res = await api.put<ApiWrapper<Task>>(`/tasks/${task.id}`, {
      status: nextStatus,
    });
    return res.data.data;
  },
};

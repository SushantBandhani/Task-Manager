import { z } from "zod";
import { TaskStatus as TaskStatusEnum } from "../generated/prisma/enums.ts";


const taskStatusSchema = z.enum([
  TaskStatusEnum.pending,
  TaskStatusEnum.in_progress,
  TaskStatusEnum.completed,
]);


export const getTasksQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => Math.max(1, parseInt(val || "1", 10))),

  limit: z
    .string()
    .optional()
    .transform((val) => Math.min(100, Math.max(1, parseInt(val || "10", 10)))),

  status: taskStatusSchema.optional(),

  search: z.string().trim().max(100).optional(),

  sort: z
    .enum(["created_at", "updated_at", "dueDate", "title"])
    .optional()
    .default("created_at"),

  order: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc"),
});


export const createTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(120, "Title must be 120 characters or fewer"),

  description: z.string().trim().nullable().optional(),

  status: taskStatusSchema.optional(),

  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: "Invalid dueDate format" }
    ),
});


export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(120, "Title must be 120 characters or fewer")
      .optional(),

    description: z.string().trim().nullable().optional(),

    status: taskStatusSchema.optional(),

    dueDate: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: "Invalid dueDate format" }
      ),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "No fields provided for update" }
  );


export const toggleTaskStatusSchema = z.object({
  status: taskStatusSchema.optional(),
});


export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});


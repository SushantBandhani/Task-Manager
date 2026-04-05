import type { Request, Response } from "express";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";
import ApiResponse from "../utils/ApiResponse.ts";
import prisma from "../lib/prisma.ts";
import type { User, Task } from "../generated/prisma/client";
import { TaskStatus as TaskStatusEnum } from "../generated/prisma/enums.ts";
import type { TaskStatus } from "../generated/prisma/enums";


const VALID_STATUSES = Object.values(TaskStatusEnum);

const VALID_SORT_FIELDS = {
  created_at: "createdAt",
  updated_at: "updatedAt",
  dueDate: "dueDate",
  title: "title",
} as const;

type SortFieldKey = keyof typeof VALID_SORT_FIELDS;


type AuthenticatedUser = Omit<User, "password" | "refreshToken">;

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

interface TaskQuery {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: string;
}

interface CreateTaskBody {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

interface UpdateTaskBody {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
}

interface ToggleTaskStatusBody {
  status?: TaskStatus;
}


const findOwnedTask = async (taskId: string, userId: string):Promise<Task> => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};


type TaskStatusValue = (typeof VALID_STATUSES)[number];

const isValidTaskStatus = (value: unknown): value is TaskStatusValue => {
  return typeof value === "string" && VALID_STATUSES.includes(value as TaskStatusValue);
};


export const getTasks = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.id;
    const query = req.query as TaskQuery;

    // ── Pagination ──
    const page = Math.max(1, Number.parseInt(query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    // ── Filters ──
    const { status, search } = query;

    // ── Sorting ──
    const rawSortField = (query.sort || "created_at") as SortFieldKey;
    const sortField = VALID_SORT_FIELDS[rawSortField] ?? "createdAt";
    const sortDir = query.order?.toLowerCase() === "asc" ? "asc" : "desc";

    // ── Build Prisma where clause ──
    const where = {
      userId,
      ...(status && isValidTaskStatus(status) && { status }),
      ...(search?.trim() && {
        title: {
          contains: search.trim(),
          mode: "insensitive" as const,
        },
      }),
    };

    // ── Run count + data queries in parallel ──
    const [total, tasks] = await prisma.$transaction([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        orderBy: { [sortField]: sortDir },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          tasks,
          pagination: {
            total,
            totalPages,
            currentPage: page,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        "Tasks fetched successfully"
      )
    );
  }
);


export const createTask = asyncHandler(
  async (
    req: AuthenticatedRequest & { body: CreateTaskBody },
    res: Response
  ) => {
    const userId = req.user.id;
    const { title, description, status, dueDate } = req.body;

    // ── Validation ──
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new ApiError(400, "Title is required");
    }

    if (title.trim().length > 120) {
      throw new ApiError(400, "Title must be 120 characters or fewer");
    }

    if (status && !isValidTaskStatus(status)) {
      throw new ApiError(
        400,
        `Status must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }

    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      throw new ApiError(400, "Invalid dueDate format");
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() ?? null,
        status: status ?? TaskStatusEnum.pending,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { task }, "Task created successfully"));
  }
);


export const getTaskById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const task = await findOwnedTask(String(req.params.id), req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, { task }, "Task fetched successfully"));
  }
);


export const updateTask = asyncHandler(
  async (
    req: AuthenticatedRequest & { body: UpdateTaskBody },
    res: Response
  ) => {
    const { id } = req.params;
    const userId = req.user.id;

    await findOwnedTask(String(id), userId);

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        throw new ApiError(400, "Title cannot be empty");
      }
      if (title.trim().length > 120) {
        throw new ApiError(400, "Title must be 120 characters or fewer");
      }
    }

    if (status !== undefined && !isValidTaskStatus(status)) {
      throw new ApiError(
        400,
        `Status must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }

    if (
      dueDate !== undefined &&
      dueDate !== null &&
      Number.isNaN(Date.parse(dueDate))
    ) {
      throw new ApiError(400, "Invalid dueDate format");
    }

    const data: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      dueDate?: Date | null;
    } = {};

    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description?.trim() ?? null;
    if (status !== undefined) data.status = status;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "No fields provided for update");
    }

    const task = await prisma.task.update({
      where: { id: String(id) },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { task }, "Task updated successfully"));
  }
);


export const deleteTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    await findOwnedTask(String(id), userId);

    await prisma.task.delete({
      where: { id: String(id) },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Task deleted successfully"));
  }
);


export const toggleTaskStatus = asyncHandler(
  async (
    req: AuthenticatedRequest & { body: ToggleTaskStatusBody },
    res: Response
  ) => {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await findOwnedTask(String(id), userId);

    const cycle: Record<TaskStatus, TaskStatus> = {
      [TaskStatusEnum.pending]: TaskStatusEnum.in_progress,
      [TaskStatusEnum.in_progress]: TaskStatusEnum.completed,
      [TaskStatusEnum.completed]: TaskStatusEnum.pending,
    };

    let nextStatus: TaskStatus;

    if (req.body?.status !== undefined) {
      if (!isValidTaskStatus(req.body.status)) {
        throw new ApiError(
          400,
          `Status must be one of: ${VALID_STATUSES.join(", ")}`
        );
      }

      nextStatus = req.body.status;
    } else {
      nextStatus = cycle[task.status as TaskStatus];
    }

    const updated = await prisma.task.update({
      where: { id: String(id) },
      data: { status: nextStatus },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { task: updated }, "Task status updated"));
  }
);
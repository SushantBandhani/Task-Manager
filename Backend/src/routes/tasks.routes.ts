import { Router } from "express";
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../controllers/tasks.controller.ts";
import verifyToken from "../middlewares/auth.middleware.ts"; 
import validate from "../middlewares/validate.middleware.ts";
import { createTaskSchema, getTasksQuerySchema, taskIdParamSchema, toggleTaskStatusSchema, updateTaskSchema } from "../validators/tasksValidators.ts";

const tasksRouter = Router();

tasksRouter.use(verifyToken);

tasksRouter.route("/")
  .get(validate(getTasksQuerySchema), getTasks)   
  .post(validate(createTaskSchema), createTask); 

tasksRouter.route("/:id")
  .get(validate(taskIdParamSchema), getTaskById)   
  .put(validate(updateTaskSchema), updateTask) 
  .delete(deleteTask); 

tasksRouter.patch("/:id/toggle", validate(toggleTaskStatusSchema), toggleTaskStatus); 

export default tasksRouter;

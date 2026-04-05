import type { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError.ts";

const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!error) return;

  if (!(error instanceof ApiError)) {
    const err = error as Error;

    return res
      .status(500)
      .send(new ApiError(500, err.message ?? "Internal Server Error"));
  }

  console.log("error message", error.message);

  return res
    .status(error.statusCode ?? 500)
    .send(new ApiError(error.statusCode ?? 500, error.message));
};

export default globalErrorHandler;
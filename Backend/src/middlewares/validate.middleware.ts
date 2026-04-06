import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import ApiError from "../utils/ApiError.ts";

const validate =
  (schema: ZodSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {

    console.log("I am the --> ",req[property]);
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return next(new ApiError(400, errorMessage));
    }

    Object.defineProperty(req, property, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };

export default validate;
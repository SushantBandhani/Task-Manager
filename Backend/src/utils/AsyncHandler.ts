import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = <
  Req extends Request = Request,
  Res extends Response = Response
>(
  requestHandler: (
    req: Req,
    res: Res,
    next: NextFunction
  ) => Promise<unknown>
): RequestHandler => {
  return (req, res, next): void => {
    Promise.resolve(requestHandler(req as Req, res as Res, next)).catch(next);
  };
};

export default asyncHandler;
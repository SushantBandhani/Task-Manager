import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.ts";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";
import type { User } from "../generated/prisma/client.ts";


type SafeUser = Omit<User, "password" | "refreshToken">;

interface DecodedToken extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}


const verifyJWT = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as DecodedToken;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token expired");
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid token");
      }
      throw new ApiError(401, "Unauthorized request");
    }


    if (!decodedToken?.id) {
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true
      },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    req.user = user;
    next();
  }
);

export default verifyJWT;
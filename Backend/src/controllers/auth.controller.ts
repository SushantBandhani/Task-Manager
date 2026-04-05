import type { Request, Response } from "express";
import ApiError from "../utils/ApiError.ts";
import asyncHandler from "../utils/AsyncHandler.ts";
import ApiResponse from "../utils/ApiResponse.ts";
import bcrypt from "bcrypt";
import { generateAuthTokens } from "../services/auth.service.ts";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.ts";
import type { User } from "../generated/prisma/client.ts";

type AuthenticatedUser = Omit<User, "password" | "refreshToken">;

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

type DecodedToken = {
  id: string;
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isVerified: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { user }, "User registration successful"));
  }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Account not verified");
  }

  const { accessToken, refreshToken } = generateAuthTokens(user);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
      maxAge: 48 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, { user: updatedUser }, "Login successful"));
});

export const logout = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
      })
      .json(new ApiResponse(200, null, "Logout successful"));
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken || typeof incomingRefreshToken !== "string") {
      throw new ApiError(401, "Unauthorized");
    }

    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as DecodedToken;
    } catch (error) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });

    if (
      !user ||
      !user.isVerified ||
      !user.refreshToken ||
      user.refreshToken !== incomingRefreshToken
    ) {
      throw new ApiError(401, "Unauthorized");
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "strict",
        maxAge: 48 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, null, "Token refreshed successfully"));
  }
);

export const getUserData = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
        },
        "User fetched successfully"
      )
    );
  }
);

import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/client";

type TokenUser = Pick<User, "id" | "firstName" | "lastName" | "email">;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const generateAuthTokens = (user: TokenUser): AuthTokens => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"] }
  );

  return { accessToken, refreshToken };
};
import jwt from "jsonwebtoken";

export enum Rights {
  Read = "R",
  ReadWrite = "RW",
}
export interface jwtPayload extends jwt.JwtPayload {
  id?: string;
  username?: string;
  rights: Rights.Read | Rights.ReadWrite;
}

export const generateToken = (payload: jwtPayload) => {
  const secretKey: string = process.env.JWT_SECRET_PHRASE?.toString() || "";
  const options = { expiresIn: process.env.JWT_EXPIRES?.toString() || "24h" };

  if (!secretKey) {
    throw new Error("JWT_SECRET_PHRASE is not defined");
  }
  return jwt.sign(payload, secretKey, options);
};

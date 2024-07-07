import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const httpStatus = res.statusCode || 500;
  res.status(httpStatus).send({ status: httpStatus, message: err.message });
};

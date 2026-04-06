import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError(401, 'Unauthorized');
  // verify token and attach user to req.user
  next();
};
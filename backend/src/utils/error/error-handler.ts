// error-handler.ts
import { NextFunction, Request, Response } from 'express';
import AppError from './AppErrorClass'; // adjust the path

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      name: err.name,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } else {
    
    // Unexpected or programming error
    return res.status(500).json({
      status: 'error',
      name: err.name || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Something went wrong',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
};

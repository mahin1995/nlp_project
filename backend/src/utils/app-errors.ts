// src/utils/AppError.ts

export enum STATUS_CODES {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
}

export interface ErrorOptions {
  name?: string;
  statusCode?: number;
  description?: string;
  isOperational?: boolean;
  errorStack?: any;
  logError?: any;
}

export  class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errorStack?: any;
  logError?: any;

  constructor({
    name = "Error",
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Something went wrong",
    isOperational = true,
    errorStack,
    logError,
  }: ErrorOptions) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = logError;

    Error.captureStackTrace(this);
  }

  // ----------- Common Static Factory Methods -----------

  static badRequest(description = "Bad Request", errorStack?: any) {
    return new AppError({
      name: "BAD_REQUEST",
      statusCode: STATUS_CODES.BAD_REQUEST,
      description,
      errorStack,
    });
  }

  static validationError(description = "Validation Error", errorStack?: any) {
    return new AppError({
      name: "VALIDATION_ERROR",
      statusCode: STATUS_CODES.BAD_REQUEST,
      description,
      errorStack,
    });
  }

  static notFound(description = "Not Found", errorStack?: any) {
    return new AppError({
      name: "NOT_FOUND",
      statusCode: STATUS_CODES.NOT_FOUND,
      description,
      errorStack,
    });
  }

  static unauthorized(description = "Unauthorized", errorStack?: any) {
    return new AppError({
      name: "UNAUTHORIZED",
      statusCode: STATUS_CODES.UNAUTHORIZED,
      description,
      errorStack,
    });
  }

  static internal(description = "Internal Server Error", errorStack?: any) {
    return new AppError({
      name: "INTERNAL_ERROR",
      statusCode: STATUS_CODES.INTERNAL_ERROR,
      description,
      errorStack,
    });
  }

  static custom(options: ErrorOptions) {
    return new AppError(options);
  }
}

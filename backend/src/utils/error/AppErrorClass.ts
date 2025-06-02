export default class AppError extends Error {
  statusCode: any;
  isOperational: any;
  errorStack: any;
  logError: any;

  constructor(
    name: string,
    statusCode: any,
    description: string,
    isOperational: any,
    errorStack: any,
    logingErrorResponse: any
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.logError = logingErrorResponse;
    Error.captureStackTrace(this);
  }
}

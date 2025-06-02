import { STATUS_CODES } from "../app-errors";
import AppError from "./AppErrorClass";

// api Specific Errors
export default class APIError extends AppError {
  constructor(
    name: any,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true,
    errorStack: any,
    logingErrorResponse: any
  ) {
    super(
      name,
      statusCode,
      description,
      isOperational,
      errorStack,
      logingErrorResponse
    );
  }
}

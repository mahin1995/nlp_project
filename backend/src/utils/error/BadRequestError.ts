import { STATUS_CODES } from "../app-errors";
import AppError from "./AppErrorClass";

// 400
export default class BadRequestError extends AppError {
  constructor(description = "Bad request", logingErrorResponse: any) {
    super(
      "NOT FOUND",
      STATUS_CODES.BAD_REQUEST,
      description,
      true,
      false,
      logingErrorResponse
    );
  }
}

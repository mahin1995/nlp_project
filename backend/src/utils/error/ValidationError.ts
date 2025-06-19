import { STATUS_CODES } from "../app-errors";
import AppError from "./AppErrorClass";

// 400
export default class ValidationError extends AppError {
  constructor(description = "Validation Error", errorStack: any) {
    super(
      "BAD REQUEST",
      STATUS_CODES.BAD_REQUEST,
      description,
      true,
      false,
      errorStack
    );
  }
}

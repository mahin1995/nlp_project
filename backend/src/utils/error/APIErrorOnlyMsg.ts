import AppError from "./AppErrorClass";

export default class APIErrorOnlyMsg extends AppError {
  constructor(
    name: any,
    statusCode: any,
    description: any,
    isOperational = true,
    errorStack: any
  ) {
    super(name, statusCode, description, isOperational, false, errorStack);
  }
}

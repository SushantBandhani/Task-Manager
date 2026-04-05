class ApiError extends Error {
  public success: false;
  public statusCode: number;
  public errorMessage: string;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    stack: string = ""
  ) {
    super(message);

    this.success = false;
    this.statusCode = statusCode;
    this.errorMessage = message;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
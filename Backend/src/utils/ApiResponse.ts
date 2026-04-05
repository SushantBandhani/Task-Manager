class ApiResponse<T> {
  public success: boolean;
  public statusCode: number;
  public data: T;
  public message: string;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  responseDateTime: string;
  data: T;
}

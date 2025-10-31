export class ApiDataWrapper<T> {
  data?: T;
  errorMessage: string | null;
  isLoading: boolean;
  constructor(data: T, isLoading: boolean, errorMessage: string | null) {
    this.data = data;
    this.isLoading = isLoading;
    this.errorMessage = errorMessage;
  }
};

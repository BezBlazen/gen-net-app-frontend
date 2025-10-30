
export type ApiDataWrapper<T> = {
  data?: T;
  error?: string;
  isLoading: boolean;
};

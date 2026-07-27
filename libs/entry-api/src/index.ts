export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  error: string;
}

export type Result<T> = Success<T> | Failure;

export * from "./fetch";
export * from "./methods";

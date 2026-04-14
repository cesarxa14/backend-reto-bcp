export interface CloudEvent<T = any> {
  id: number;
  source: string;
  type: string;
  data: T;
  forceError?: boolean;
}
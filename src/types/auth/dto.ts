export interface StatChange {
  id: string;
  stat: boolean;
}

export interface OpResult {
  isSuccess: boolean;
  errors: string[];
}

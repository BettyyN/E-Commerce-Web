export interface BaseDto {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface RawBaseDto {
  id: string;
  isDeleted: boolean;
}

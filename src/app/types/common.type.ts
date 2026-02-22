export type TApiRes<T> = {
  message: string;
  meta?: TPaginationMeta;
  data: T;
};

export enum SortOrderEnum {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type TSortRequest = {
  sortField?: string;
  sortOrder?: SortOrderEnum;
};

export type TPaginateRequest = {
  pageSize?: number;
  page?: number;
};

export type TPaginationRequest = TSortRequest &
  TPaginateRequest & {
    isExport?: boolean;
    filters?: Record<string, any>;
    search?: string;
    dateRangeColumn?: string;
    startAt?: string;
    endAt?: string;
  };

export type TPaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
};

export type TPaginateResponse<T> = {
  meta: TPaginationMeta | undefined;
  data: Array<T>;
};

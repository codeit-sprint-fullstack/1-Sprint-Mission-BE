export interface PagenationQuery {
  page?: string;
  pageSize?: string;
  orderBy?: string;
  keyWord?: string;
}

export interface UserId {
  userId: string;
}

export interface CursorQuery {
  cursor?: string;
  pageSize?: string;
  orderBy?: string;
}

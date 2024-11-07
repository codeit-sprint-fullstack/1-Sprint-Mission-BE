type Sort = "asc" | "desc";

export interface CreatedAtOrder {
  createdAt?: Sort;
}

export interface PagenationParams {
  orderBy?: CreatedAtOrder;
  skip?: number;
  take?: number;
}

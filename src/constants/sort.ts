export const ORDER_BY: { [id: string]: { [id: string]: string } } = {
  recent: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  favorite: { favoriteCount: "desc" },
};

export const DEFAULT_ORDER_BY: { [id: string]: string } = { createdAt: "desc" };

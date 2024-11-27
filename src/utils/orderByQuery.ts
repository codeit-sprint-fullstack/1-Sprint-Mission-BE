export function setOrderByQuery(orderBy: string): { [key: string]: string } {
  switch (orderBy) {
    case "title":
      return { title: "asc" };
    case "recent":
      return { createAt: "desc" };
    case "oldset":
      return { createAt: "asc" };
    case "favorite":
      return { favoriteCount: "desc" };
    default:
      return { createAt: "desc" };
  }
}

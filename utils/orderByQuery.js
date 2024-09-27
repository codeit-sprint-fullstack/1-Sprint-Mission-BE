export function setOrderByQuery(orderBy) {
  switch (orderBy) {
    case "title":
      return { title: "asc" };
      break;
    case "recent":
      return { createAt: "desc" };
      break;
    case "oldset":
      return { createAt: "asc" };
      break;
    case "favorite":
      return { favorite: "desc" };
      break;
    default:
      return { createAt: "desc" };
  }
}

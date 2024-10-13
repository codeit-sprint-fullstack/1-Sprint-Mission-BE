function createCursorResponse(list, total, pageSize) {
  const lastList = list[pageSize];
  const NextCusor = lastList ? lastList.id : "null";
  if (NextCusor !== "null") {
    list.pop();
  }

  return {
    cursorInfo: {
      total,
      NextCusor,
    },
    list,
  };
}

export default createCursorResponse;

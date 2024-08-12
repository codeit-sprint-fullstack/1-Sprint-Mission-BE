export const articles = [
  {
    title: "First Article Title",
    content: "First Article Content",
    createdAt: new Date(),
  },
  {
    title: "Second Article Title",
    content: "Second Article Content",
    createdAt: new Date(),
  },
  {
    title: "Third Article Title",
    content: "Third Article Content",
    createdAt: new Date(),
  },
];

export const comments = [
  {
    content: "First article Comment",
    category: "BOARD",
    createdAt: new Date(),
    article: {
      connect: { title: "First Article Title" },
    },
  },
  {
    content: "Second article Comment",
    category: "MARKET",
    createdAt: new Date(),
    article: {
      connect: { title: "Second Article Title" },
    },
  },
  {
    content: "Third article Comment",
    category: "BOARD",
    createdAt: new Date(),
    article: {
      connect: { title: "Third Article Title" },
    },
  },
];

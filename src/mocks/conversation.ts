export const conversationMock = {
  id: "1",
  title: "Proyecto Universidad",
  description: "Base de datos para el proyecto de la universidad",
  schemas: {
    sql: '',
    prisma: '',
    mongoose: '',
  },
  diagram: {},
  messages: [
    {
      id: "1",
      role: "user",
      content: "Create a database schema for a blog with users, posts, and comments",
      timestamp: new Date(2023, 4, 10, 14, 30),
    },
    {
      id: "2",
      role: "assistant",
      content: "I've created a schema with three tables: Users, Posts, and Comments. Users have a one-to-many relationship with Posts, and Posts have a one-to-many relationship with Comments.",
      timestamp: new Date(2023, 4, 10, 14, 31),
    },
    {
      id: "3",
      role: "user",
      content:
        "Add a categories table and link it to posts",
      timestamp: new Date(2023, 4, 10, 14, 32),
    },
  ]
}
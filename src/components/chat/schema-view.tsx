"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SchemaView() {
  const [activeTab, setActiveTab] = useState("sql")

  const schemas = {
    sql: `CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  content TEXT NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES Posts(id),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE PostCategories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES Posts(id),
  FOREIGN KEY (category_id) REFERENCES Categories(id)
);`,

    prisma: `model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique @db.VarChar(50)
  email     String   @unique @db.VarChar(100)
  password  String   @db.VarChar(255)
  createdAt DateTime @default(now()) @map("created_at")
  posts     Post[]
  comments  Comment[]
}

model Post {
  id         Int      @id @default(autoincrement())
  title      String   @db.VarChar(100)
  content    String   @db.Text
  userId     Int      @map("user_id")
  createdAt  DateTime @default(now()) @map("created_at")
  user       User     @relation(fields: [userId], references: [id])
  comments   Comment[]
  categories PostCategory[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  postId    Int      @map("post_id")
  userId    Int      @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")
  post      Post     @relation(fields: [postId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(50)
  posts PostCategory[]
}

model PostCategory {
  postId     Int @map("post_id")
  categoryId Int @map("category_id")
  post       Post     @relation(fields: [postId], references: [id])
  category   Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])
}`,

    mongoose: `const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

const CommentSchema = new Schema({
  content: { type: String, required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true }
});`,
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sql">SQL</TabsTrigger>
          <TabsTrigger value="prisma">Prisma</TabsTrigger>
          <TabsTrigger value="mongoose">Mongoose</TabsTrigger>
        </TabsList>

        {Object.entries(schemas).map(([key, schema]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <Card className="p-4 bg-muted">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">{schema}</pre>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

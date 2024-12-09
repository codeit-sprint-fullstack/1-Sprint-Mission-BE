import prisma from "../models/index";
import { Prisma, Comment } from "@prisma/client";

export class CommentRepository {
  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({
      data,
      include: { writer: true },
    });
  }

  async findMany(options: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return prisma.comment.findMany(options);
  }

  async update(commentId: number, content: string): Promise<Comment> {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: { writer: true },
    });
  }

  async delete(commentId: number): Promise<void> {
    await prisma.comment.delete({
      where: { id: commentId },
    });
  }
}

export default new CommentRepository();

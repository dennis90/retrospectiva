import { z } from 'zod';
import { createProtectedRouter } from './context';

export const boardAdminRouter = createProtectedRouter()
  .query('list', {
    async resolve({ ctx }) {
      return await ctx.prisma.board.findMany({
        where: {
          ownerId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation('new', {
    input: z.object({
      name: z.string(),
      maxVotesPerUser: z.number().min(1).max(10),
      enableVoting: z.boolean(),
      hideVotes: z.boolean(),
      hideCards: z.boolean(),
      isPublic: z.boolean(),
      boardPassword: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.board.create({
        data: {
          name: input.name,
          maxVotesPerUser: input.maxVotesPerUser,
          enableVoting: input.enableVoting,
          hideVotes: input.hideVotes,
          hideCards: input.hideCards,
          isPublic: input.isPublic,
          boardPassword: input.boardPassword,
          ownerId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation('update', {
    input: z.object({
      name: z.string().optional(),
      maxVotesPerUser: z.number().min(1).max(10).optional(),
      enableVoting: z.boolean().optional(),
      hideVotes: z.boolean().optional(),
      hideCards: z.boolean().optional(),
      isPublic: z.boolean().optional(),
      boardPassword: z.string().optional().optional(),
      id: z.string(),
    }),

    async resolve({ ctx, input }) {
      return await ctx.prisma.board.updateMany({
        data: {
          name: input.name,
          maxVotesPerUser: input.maxVotesPerUser,
          enableVoting: input.enableVoting,
          hideVotes: input.hideVotes,
          hideCards: input.hideCards,
          isPublic: input.isPublic,
          boardPassword: input.boardPassword,
        },
        where: {
          ownerId: ctx.session.user.id,
          id: input.id,
        },
      });
    },
  })
  .mutation('new-column', {
    input: z.object({
      name: z.string(),
      boardId: z.string(),
      color: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.boardColumn.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          color: input.color,
        },
      });
    },
  });

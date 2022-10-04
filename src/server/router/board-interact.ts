import { z } from 'zod';
import { createProtectedRouter } from './context';

export const boardInteractRouter = createProtectedRouter()
  .query('get', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.board.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          maxVotesPerUser: true,
          enableVoting: true,
          hideVotes: true,
          hideCards: true,
          isPublic: true,
          boardPassword: true,
          ownerId: true,
          BoardColumn: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });
    },
  })
  .query('cards', {
    input: z.object({
      boardId: z.string(),
      columnId: z.string(),
      showText: z.boolean().nullable(),
      showVoteCount: z.boolean().nullable(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.card.findMany({
        where: {
          boardId: input.boardId,
          columnId: input.columnId,
        },
        select: {
          id: true,
          name: !!input.showText,
          columnId: true,
          _count: {
            select: {
              votes: !!input.showVoteCount,
            },
          },
        },
      });
    },
  })
  .mutation('new-card', {
    input: z.object({
      name: z.string(),
      boardId: z.string(),
      columnId: z.string(),
    }),

    async resolve({ ctx, input }) {
      return await ctx.prisma.card.create({
        data: {
          name: input.name,
          boardId: input.boardId,
          columnId: input.columnId,
          ownerId: ctx.session.user.id,
        },
      });
    },
  });

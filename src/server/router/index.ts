// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

// import { exampleRouter } from "./example";
import { boardAdminRouter } from './board-admin';
import { boardInteractRouter } from './board-interact';
// import { protectedExampleRouter } from './protected-example-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('board-admin.', boardAdminRouter)
  .merge('board.', boardInteractRouter);
// .merge('auth.', protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

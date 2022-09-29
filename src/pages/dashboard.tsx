import { trpc } from '../utils/trpc';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import withSessionRequired from '../utils/auth';

const Dashboard: NextPage = () => {
  const { data } = trpc.useQuery(['board-admin.list']);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <h1 className="text-3xl md:text[3rem] leading-normal font-extrabold text-gray-700">
          Dashboard
        </h1>
        <div>
          <Link href="board/new">
            <button>Create a new Board</button>
          </Link>
        </div>

        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
          {data?.map((board) => (
            <div key={board.id}>
              <Link href={`board/${board.id}`}>
                <h2>{board.name}</h2>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default withSessionRequired(Dashboard);

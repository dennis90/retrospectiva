import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { trpc } from '../../utils/trpc';

const Board: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { boardId } = router.query;
  const { data } = trpc.useQuery(['board.get', { id: String(boardId) }], {
    refetchInterval: 30_000,
  });

  const columnNameRef = useRef<HTMLInputElement>(null);
  const columnColorRef = useRef<HTMLInputElement>(null);

  const { mutate } = trpc.useMutation(['board-admin.new-column']);

  const isOwner = sessionData?.user?.id === data?.ownerId;

  return (
    <>
      <Head>
        <title>{data?.name}</title>
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <div className="flex">
          <h1 className="text-3xl md:text[3rem] leading-normal font-extrabold text-gray-700">
            {data?.name}
          </h1>
          {isOwner && (
            <span className="text-xs rounded-xl border-neutral-600 py-0 px-2 mx-4 bg-blue-700 text-white self-center">
              Admin
            </span>
          )}
        </div>

        {isOwner && (
          <div>
            <div>
              <label htmlFor="column-name">Column Name</label>
              <input
                name="column-name"
                type="text"
                id="column-name"
                ref={columnNameRef}
              />
            </div>
            <div>
              <label htmlFor="column-color">Column Color</label>
              <input
                name="column-color"
                type="color"
                id="column-color"
                ref={columnColorRef}
              />
            </div>
            <button
              onClick={() => {
                mutate({
                  boardId: String(boardId),
                  name: columnNameRef.current?.value || '',
                  color: columnColorRef.current?.value || '#ffffff',
                });
              }}
            >
              Add Column
            </button>
          </div>
        )}

        <div>
          {data?.BoardColumn.map((column) => (
            <div key={column.id} className={`bg-[${column.color}]`}>
              <h2>{column.name}</h2>
              <div>Cards placeholder</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Board;

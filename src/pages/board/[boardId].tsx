import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import Column from '../../components/board/Column';
import NewCardForm from '../../components/board/NewCardForm';
import { trpc } from '../../utils/trpc';

const Board: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { boardId } = router.query;
  const { data, refetch } = trpc.useQuery(
    ['board.get', { id: String(boardId) }],
    {
      refetchInterval: 30_000,
    }
  );

  const newCardRef = useRef<HTMLInputElement>(null);

  const columnNameRef = useRef<HTMLInputElement>(null);
  const columnColorRef = useRef<HTMLInputElement>(null);

  const { mutate: newColumnMutate } = trpc.useMutation(
    ['board-admin.new-column'],
    {
      onSuccess: () => refetch(),
    }
  );

  const { mutate: deleteColumnMutate } = trpc.useMutation(
    ['board-admin.delete-column'],
    {
      onSuccess: () => refetch(),
    }
  );

  const isOwner = sessionData?.user?.id === data?.ownerId;

  return (
    <>
      <Head>
        <title>{data?.name}</title>
      </Head>

      <main className="container mx-auto flex flex-col items-center p-4">
        <div className="flex">
          <h1 className="md:text[3rem] text-3xl font-extrabold leading-normal">
            {data?.name}
          </h1>
          {isOwner && (
            <span className="mx-4 self-center rounded-xl border-neutral-600 bg-blue-700 py-0 px-2 text-xs text-white">
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
                className="input"
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
                newColumnMutate({
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

        <div className="flex flex-row gap-3">
          {data?.BoardColumn.map((column) => (
            <Column
              key={column.id}
              color={column.color}
              name={column.name}
              columnId={column.id}
              boardId={data.id}
              onRevalidate={refetch}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default Board;

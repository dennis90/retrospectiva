import { trpc } from '../../utils/trpc';
import NewCardForm from './NewCardForm';

export interface ColumnProps {
  color: string;
  name: string;
  columnId: string;
  boardId: string;
  onRevalidate: () => void;
}

const Column = ({ name, color, columnId, boardId, ...props }: ColumnProps) => {
  const { data, refetch } = trpc.useQuery([
    'board.cards',
    { boardId, columnId, showText: true, showVoteCount: true },
  ]);

  return (
    <div>
      <h2>{name}</h2>
      <div style={{ background: color }}>
        {data?.map((card) => (
          <div key={card.id}>
            <h3>{card.name}</h3>
            <p>{card._count.votes}</p>
          </div>
        ))}

        <div>
          <NewCardForm
            boardId={boardId}
            columnId={columnId}
            onRevalidate={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Column;

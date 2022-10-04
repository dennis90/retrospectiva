import { useRef } from 'react';
import { trpc } from '../../utils/trpc';

export interface CardProps {
  onRevalidate: () => void;
  boardId: string;
  columnId: string;
}

const Card = (props: CardProps) => {
  const newCardRef = useRef<HTMLInputElement>(null);
  const { mutate: newCardMutate } = trpc.useMutation(['board.new-card'], {
    onSuccess: () => {
      props.onRevalidate();
      if (newCardRef.current) {
        newCardRef.current.value = '';
      }
    },
  });

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    newCardMutate({
      boardId: props.boardId,
      columnId: props.columnId,
      name: newCardRef.current?.value ?? '',
    });
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div className="field-container">
        <label htmlFor="name">Name</label>
        <input
          ref={newCardRef}
          className="input"
          type="text"
          name="name"
          id="name"
          required
        />

        <button type="submit" className="primary-button">
          +
        </button>
      </div>
    </form>
  );
};

export default Card;

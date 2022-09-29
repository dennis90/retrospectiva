import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import withSessionRequired from '../../utils/auth';
import usePrevious from '../../utils/hooks/usePrevious';
import { trpc } from '../../utils/trpc';
import Router from 'next/router';

const NewBoardForm: NextPage = () => {
  const { mutate, status } = trpc.useMutation('board-admin.new');
  const prevStatus = usePrevious(status);

  const nameRef = useRef<HTMLInputElement>(null);
  const maxVotesPerUserRef = useRef<HTMLInputElement>(null);
  const enableVotingRef = useRef<HTMLInputElement>(null);
  const hideVotesRef = useRef<HTMLInputElement>(null);
  const hideCardsRef = useRef<HTMLInputElement>(null);
  const isPublicRef = useRef<HTMLInputElement>(null);

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate({
      name: nameRef.current?.value ?? '',
      maxVotesPerUser: maxVotesPerUserRef.current?.valueAsNumber ?? 1,
      enableVoting: enableVotingRef.current?.checked ?? false,
      hideCards: hideCardsRef.current?.checked ?? false,
      hideVotes: hideVotesRef.current?.checked ?? false,
      isPublic: isPublicRef.current?.checked ?? false,
    });
  };

  useEffect(() => {
    if (prevStatus === 'loading' && status === 'success') {
      Router.push('/dashboard');
    }
  }, [status, prevStatus]);

  return (
    <div>
      <h1>New Board</h1>
      <form className="form" onSubmit={formSubmitHandler}>
        <div className="field-container">
          <label htmlFor="name">Name</label>
          <input
            className="input"
            type="text"
            name="name"
            id="name"
            ref={nameRef}
            required
          />
        </div>
        <div className="field-container">
          <label htmlFor="maxVotesPerUser">Max votes per user</label>
          <input
            ref={maxVotesPerUserRef}
            className="input"
            type="number"
            min={1}
            max={10}
            name="maxVotesPerUser"
            id="maxVotesPerUser"
          />
        </div>
        <div className="field-container">
          <label htmlFor="enableVoting">Enable voting</label>
          <input
            ref={enableVotingRef}
            className="input"
            type="checkbox"
            name="enableVoting"
            id="enableVoting"
          />
        </div>
        <div className="field-container">
          <label htmlFor="hideVotes">Hide votes</label>
          <input
            ref={hideVotesRef}
            className="input"
            type="checkbox"
            name="hideVotes"
            id="hideVotes"
          />
        </div>
        <div className="field-container">
          <label htmlFor="hideCards">Hide cards</label>
          <input
            ref={hideCardsRef}
            className="input"
            type="checkbox"
            name="hideCards"
            id="hideCards"
          />
        </div>
        <div className="field-container">
          <label htmlFor="isPublic">Allow anonymous users</label>
          <input
            ref={isPublicRef}
            className="input"
            type="checkbox"
            name="isPublic"
            id="isPublic"
          />
        </div>
        <button type="submit" className="primary-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default withSessionRequired(NewBoardForm);

import { useSession, signIn } from 'next-auth/react';

export default function withSessionRequired<T extends object>(
  Component: React.ComponentType<T>
) {
  const WithSessionRequired = (props: T) => {
    const { data } = useSession();
    if (!data) {
      return (
        <div>
          <p>Not signed in</p>
          <button onClick={() => signIn('google')}>Sign in to continue</button>
        </div>
      );
    }
    return <Component {...props} />;
  };
  return WithSessionRequired;
}

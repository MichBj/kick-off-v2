import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@lib/userContext';
import Loading from '@ui/common/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
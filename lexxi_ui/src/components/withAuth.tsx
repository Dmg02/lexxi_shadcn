import { useAuth } from '@/context/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isAuthChecked } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isAuthChecked && !user) {
        router.push('/login');
      }
    }, [isAuthChecked, user, router]);

    if (!isAuthChecked) {
      return <div>Loading...</div>; // Or a proper loading component
    }

    if (!user) {
      return null; // Don't render anything while redirecting
    }

    return <WrappedComponent {...props} />;
  };
}
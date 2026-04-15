'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { hydrateAuth } from '@/store/slices/authSlice';

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { token } = useSelector(s => s.auth);

    useEffect(() => {
      dispatch(hydrateAuth());
    }, [dispatch]);

    useEffect(() => {
      if (token === null) {
        // give a tick for hydration
        const t = setTimeout(() => {
          const { default: Cookies } = require('js-cookie');
          if (!Cookies.get('token')) {
            router.replace('/login');
          }
        }, 100);
        return () => clearTimeout(t);
      }
    }, [token, router]);

    if (!token) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

import { useEffect, useState } from 'react';
import Navbar from '../components/UI/Navbar/Navbar';
import { Outlet, useLocation, useNavigate, useSubmit } from 'react-router-dom';
import { getAuthToken, getTokenDuration } from '../utils/auth-utils';

export default function Root() {
  const [showNavBar, setShowNavBar] = useState(false);
  let location = useLocation();
  const token = getAuthToken();
  const submit = useSubmit();
  const navigate = useNavigate();

  useEffect(() => {
    const notLoginRoute = location.pathname !== '/login';
    setShowNavBar(notLoginRoute);

    if (!token) {
      if (notLoginRoute) {
        navigate('/login', { replace: true });
      }

      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    if (notLoginRoute === false) {
      navigate('/', { replace: true });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  }, [location, navigate, submit, token]);

  return (
    <>
      {showNavBar && <Navbar />}
      <Outlet />
    </>
  );
}

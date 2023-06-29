import axios from 'axios';
import Navbar from '../components/UI/Navbar/Navbar';
import { useContext, useEffect, useState } from 'react';
import { CurrentUserContext } from '../store/current-user-context';
import { getAuthToken, getTokenDuration } from '../utils/auth-utils';
import { Outlet, useLocation, useNavigate, useSubmit } from 'react-router-dom';

export default function Root() {
  const [showNavBar, setShowNavBar] = useState(false);
  const currentUserContext = useContext(CurrentUserContext);
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

  useEffect(() => {
    const setCurrentUserContext = async () => {
      if (Object.keys(currentUserContext.user).length < 1) {
        const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
        const meResponse = await axios.get(`${API_URL}/user/me`);
        const user = await meResponse.data;
        currentUserContext.setUser(user);
      }
    };

    if (token && token !== 'EXPIRED') {
      setCurrentUserContext();
    }
  }, [currentUserContext, token]);

  return (
    <>
      {showNavBar && <Navbar />}
      <Outlet />
    </>
  );
}

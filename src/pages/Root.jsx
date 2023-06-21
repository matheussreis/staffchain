import { useEffect, useState } from 'react';
import Navbar from '../components/UI/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';

export default function Root() {
  const [showNavBar, setShowNavBar] = useState(true);
  let location = useLocation();

  useEffect(() => {
    setShowNavBar(location.pathname !== '/login');

    // Add logic to check the if the current user's token is valid.
  }, [location]);

  return (
    <>
      {showNavBar && <Navbar />}
      <Outlet />
    </>
  );
}

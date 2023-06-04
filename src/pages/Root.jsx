import { Outlet } from 'react-router-dom';
import Navbar from '../components/UI/Navbar/Navbar';

export default function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

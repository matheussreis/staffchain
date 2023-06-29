import axios from 'axios';
import Me from './pages/Me/Me';
import Root from './pages/Root';
import { useState } from 'react';
import Login from './pages/Login';
import User from './pages/User/User';
import NotFound from './pages/NotFound';
import EditUser from './pages/User/EditUser';
import ListUser from './pages/User/ListUser';
import Process from './pages/Process/Process';
import Request from './pages/Request/Request';
import ListProcess from './pages/Process/ListProcess';
import EditProcess from './pages/Process/EditProcess';
import ListRequest from './pages/Request/ListRequest';
import EditRequest from './pages/Request/EditRequest';
import { action as logoutAction } from './pages/Logout';
import { CurrentUserContext } from './store/current-user-context';
import { checkAuthLoader, getAuthToken } from './utils/auth-utils';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import 'primereact/resources/primereact.min.css';
import './theme.css';

axios.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    id: 'root',
    children: [
      {
        path: 'user',
        id: 'user',
        loader: checkAuthLoader,
        children: [
          { index: true, element: <ListUser /> },
          { path: 'create', element: <EditUser /> },
          {
            path: ':id',
            children: [
              { index: true, element: <User /> },
              { path: 'edit', element: <User /> },
            ],
          },
        ],
      },
      {
        path: 'process',
        id: 'process',
        loader: checkAuthLoader,
        children: [
          { index: true, element: <ListProcess /> },
          { path: 'create', element: <EditProcess /> },
          {
            path: ':id',
            children: [
              { index: true, element: <Process /> },
              { path: 'edit', element: <Process /> },
            ],
          },
        ],
      },
      {
        path: 'request',
        id: 'request',
        loader: checkAuthLoader,
        children: [
          { index: true, element: <ListRequest /> },
          { path: 'create', element: <EditRequest /> },
          {
            path: ':id',
            children: [
              { index: true, element: <Request /> },
              { path: 'edit', element: <Request /> },
            ],
          },
        ],
      },
      {
        path: 'me',
        id: 'me',
        loader: checkAuthLoader,
        children: [
          { index: true, element: <Me /> },
          { path: 'edit', element: <Me /> },
        ],
      },
      {
        path: 'login',
        id: 'login',
        element: <Login />,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  const [user, setUser] = useState({});

  return (
    <CurrentUserContext.Provider value={{ user: user, setUser: setUser }}>
      <RouterProvider router={router} />;
    </CurrentUserContext.Provider>
  );
}

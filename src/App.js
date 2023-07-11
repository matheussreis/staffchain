import axios from 'axios';
import Root from './pages/Root';
import { useState } from 'react';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import EditUser from './pages/User/EditUser';
import Process, { loader as processLoader } from './pages/Process/Process';
import Request, { loader as requestLoader } from './pages/Request/Request';
import GeneralError from './pages/GeneralError';
import ListProcess, {
  loader as listProcessLoader,
} from './pages/Process/ListProcess';
import EditProcess from './pages/Process/EditProcess';
import ListRequest, {
  loader as listRequestLoader,
} from './pages/Request/ListRequest';
import EditRequest from './pages/Request/EditRequest';
import Me, { loader as meLoader } from './pages/Me/Me';
import { action as logoutAction } from './pages/Logout';
import User, { loader as UserLoader } from './pages/User/User';
import { CurrentUserContext } from './store/current-user-context';
import { checkAuthLoader, getAuthToken } from './utils/auth-utils';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ListUser, { loader as listUserLoader } from './pages/User/ListUser';

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
    errorElement: <GeneralError />,
    children: [
      {
        path: 'user',
        id: 'user',
        loader: checkAuthLoader,
        children: [
          { index: true, element: <ListUser />, loader: listUserLoader },
          { path: 'create', element: <EditUser /> },
          {
            path: ':id',
            children: [
              { index: true, element: <User />, loader: UserLoader },
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
          { index: true, element: <ListProcess />, loader: listProcessLoader },
          { path: 'create', element: <EditProcess /> },
          {
            path: ':id',
            children: [
              { index: true, element: <Process />, loader: processLoader },
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
          { index: true, element: <ListRequest />, loader: listRequestLoader },
          { path: 'create', element: <EditRequest /> },
          {
            path: ':id',
            children: [
              { index: true, element: <Request />, loader: requestLoader },
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
          { index: true, element: <Me />, loader: meLoader },
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
      <RouterProvider router={router} />
    </CurrentUserContext.Provider>
  );
}

import Root from './pages/Root';
import Login from './pages/Login';
import User from './pages/User/User';
import ViewMe from './pages/Me/ViewMe';
import EditMe from './pages/Me/EditMe';
import EditUser from './pages/User/EditUser';
import ListUser from './pages/User/ListUser';
import Process from './pages/Process/Process';
import ListProcess from './pages/Process/ListProcess';
import EditProcess from './pages/Process/EditProcess';
import ListRequest from './pages/Request/ListRequest';
import EditRequest from './pages/Request/EditRequest';
import ViewRequest from './pages/Request/ViewRequest';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    id: 'root',
    children: [
      {
        path: 'user',
        id: 'user',
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
        children: [
          { index: true, element: <ListRequest /> },
          { path: 'create', element: <EditRequest /> },
          {
            path: ':id',
            children: [
              { index: true, element: <ViewRequest /> },
              { path: 'edit', element: <EditRequest /> },
            ],
          },
        ],
      },
      {
        path: 'me',
        id: 'me',
        children: [
          { index: true, element: <ViewMe /> },
          { path: 'edit', element: <EditMe /> },
        ],
      },
      {
        path: 'login',
        id: 'login',
        element: <Login />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

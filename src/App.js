import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    id: 'root',
    children: [],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

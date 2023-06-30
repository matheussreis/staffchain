import { useRouteError } from 'react-router';
import ErrorContent from '../components/ErrorContent/ErrorContent';

export default function GeneralError() {
  const error = useRouteError();
  let title = 'Unexpected Error';
  let message = '';

  message = error.data?.message ?? message;
  title = error.data?.title ?? title;

  return <ErrorContent title={title} message={message} redirectTo={-1} />;
}

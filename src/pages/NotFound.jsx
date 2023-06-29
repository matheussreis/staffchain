import React from 'react';
import ErrorContent from '../components/ErrorContent/ErrorContent';

const NotFound = () => {
  return (
    <ErrorContent
      title="Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
};

export default React.memo(NotFound);

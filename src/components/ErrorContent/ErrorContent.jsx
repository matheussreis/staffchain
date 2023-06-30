import React from 'react';
import Button from '../UI/Button/Button';
import { useNavigate } from 'react-router-dom';

import classes from './ErrorContent.module.css';

const ErrorContent = ({ title, message, redirectTo = '/' }) => {
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      {title && <h1 className={classes.title}>{title}</h1>}
      {message && <p className={classes.message}>{message}</p>}
      <Button onClick={() => navigate(redirectTo)}>Return</Button>
    </div>
  );
};

export default React.memo(ErrorContent);

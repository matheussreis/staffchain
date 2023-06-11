import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Anchor.module.css';

export default React.memo(function Anchor({ to, className, state, children }) {
  return (
    <Link className={`${classes.anchor} ${className}`} to={to} state={state}>
      {children}
    </Link>
  );
});

import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Anchor.module.css';

export default React.memo(function Anchor({ to, className, children }) {
  return (
    <Link className={`${classes.anchor} ${className}`} to={to}>
      {children}
    </Link>
  );
});

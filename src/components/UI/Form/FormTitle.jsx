import React from 'react';

import classes from './FormTitle.module.css';

export default React.memo(function FormTitle({ text }) {
  return <h1 className={classes.title}>{text}</h1>;
});

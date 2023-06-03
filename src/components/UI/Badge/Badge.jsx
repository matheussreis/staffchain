import React from 'react';

import classes from './Badge.module.css';

export default React.memo(function Badge({ text, color = 'black' }) {
  const styles = {
    backgroundColor: color,
    border: `1px ${color} solid`,
  };

  return (
    <div className={classes.badge} style={styles}>
      {text}
    </div>
  );
});

import React from 'react';

import classes from './FormTitle.module.css';

export default React.memo(function FormTitle({ text, className, children }) {
  const getCssClasses = (initialClass = '') => {
    let cssClasses = classes[initialClass];

    if (className) {
      cssClasses += ` ${className}`;
    }

    return cssClasses;
  };

  return <h1 className={getCssClasses('title')}>{children ?? text}</h1>;
});

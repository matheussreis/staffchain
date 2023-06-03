import React from 'react';

import classes from './List.module.css';

export default function List({ className, scrollable = false, children }) {
  const getListClasses = (className = undefined) => {
    let listClasses = classes.list;
  
    if (className) {
      listClasses += ` ${className}`;
    }

    if (scrollable) {
      listClasses += ` ${classes.scrollable}`;
    }
  
    return listClasses;
  };

  return <ul className={getListClasses(className)}>{children}</ul>;
}

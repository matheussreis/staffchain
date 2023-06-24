import Container from '../Container/Container';

import classes from './FormRow.module.css';

export default function FormRow({ className, children }) {
  const getFormRowClasses = () => {
    let cssClasses = classes.row;

    if (className) {
      cssClasses += ` ${className}`;
    }

    return cssClasses;
  };

  return <Container className={getFormRowClasses()}>{children}</Container>;
}

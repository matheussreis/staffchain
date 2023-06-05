import Container from '../Container/Container';

import classes from './FormRow.module.css';

export default function FormRow({ children }) {
  return <Container className={classes.row}>{children}</Container>;
}

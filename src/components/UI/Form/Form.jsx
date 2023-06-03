import Card from '../Card/Card';

import classes from './Form.module.css';

export default function Form({
  method = 'post',
  onSubmit,
  className,
  children,
  unStyled = false,
}) {
  const Container = unStyled ? 'div' : Card;

  return (
    <Container className={!unStyled ? classes.card : ''}>
      <form method={method} onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </Container>
  );
}

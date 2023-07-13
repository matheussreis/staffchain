import Anchor from '../Anchor/Anchor';

import classes from './ListItemHeader.module.css';

export default function ListItemHeader({
  title,
  sendTo,
  data,
  anchorDisabled = false,
}) {
  const Container = anchorDisabled ? 'span' : Anchor;

  return (
    <Container className={classes['title-link']} to={sendTo} state={data}>
      <h3 className={classes.title}>{title}</h3>
    </Container>
  );
}

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';

import classes from './DashboardPanel.module.css';

export default function DashboardPanel({ title, onViewMoreClick, children }) {
  return (
    <Card className={classes.card}>
      <header className={classes.header}>
        <h2>{title}</h2>
        <Button onClick={onViewMoreClick} isAlt={true}>
          View More
        </Button>
      </header>
      <main className={classes.content}>{children}</main>
    </Card>
  );
}

import classes from './DashboardPanelNoItems.module.css';

export default function DashboardPanelNoItems({ title, message }) {
  return (
    <div className={classes.container}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}

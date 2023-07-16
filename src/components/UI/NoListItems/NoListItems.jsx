import classes from './NoListItems.module.css';

export default function NoListItems({ title, message }) {
  return (
    <div className={classes.container}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}

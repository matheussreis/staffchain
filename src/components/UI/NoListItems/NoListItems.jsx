import classes from './NoListItems.module.css';

export default function NoListItems({ title, message, isPageContent = false }) {
  const TitleComponent = isPageContent ? 'h2' : 'h4';

  return (
    <div className={classes.container}>
      <TitleComponent className={classes.content}>{title}</TitleComponent>
      <p className={classes.content}>{message}</p>
    </div>
  );
}

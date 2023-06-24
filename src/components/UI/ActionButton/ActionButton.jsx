import { SplitButton } from 'primereact/splitbutton';

import classes from './ActionButton.module.css';

export default function ActionButton({ label, items, onClick, className }) {
  return (
    <SplitButton
      buttonClassName={classes['default-button']}
      menuButtonClassName={classes['menu-button']}
      className={`${classes.button} ${className}`}
      label={label}
      size="small"
      onClick={onClick}
      model={items}
    />
  );
}

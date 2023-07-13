import BUTTON_SIZES from '../../../enums/button-sizes';
import Button from '../Button/Button';

import classes from './ListItemControls.module.css';

export default function ListItemControls({ onClick, buttonName = 'Open' }) {
  return (
    <div className={classes['content-container']}>
      <Button onClick={onClick} size={BUTTON_SIZES.SMALL} isAlt={false}>
        {buttonName}
      </Button>
    </div>
  );
}

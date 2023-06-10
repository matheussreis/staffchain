import Button from '../Button/Button';
import BUTTON_SIZES from '../../../enums/button-sizes';
import upperCaseWords from '../../../utils/string-utlis';

import classes from './HeadPanel.module.css';

export default function HeadPanel({
  moduleName = '',
  recordCount = 0,
  onClick,
  buttonText = 'New',
}) {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h2>
          {upperCaseWords(moduleName)} ({recordCount})
        </h2>
        <Button
          className={classes.button}
          size={BUTTON_SIZES.MEDIUM}
          onClick={onClick}
          isAlt={true}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

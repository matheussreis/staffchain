import React from 'react';
import BUTTON_SIZES from '../../../enums/button-sizes';

import classes from './Button.module.css';

export default React.memo(function Button({
  type = 'button',
  onClick,
  disabled = false,
  size = BUTTON_SIZES.MEDIUM,
  isAlt = false,
  className,
  children,
}) {
  const getButtonClasses = () => {
    const buttonColorClass = isAlt ? classes.alt : classes.regular;
    let buttonClasses = `${classes.button} ${classes[size]} ${buttonColorClass}`;

    if (disabled) {
      buttonClasses = `${buttonClasses} ${classes.disabled}`;
    }

    if (className) {
      buttonClasses += ` ${className}`;
    }

    return buttonClasses;
  };

  return (
    <button
      disabled={disabled}
      className={getButtonClasses()}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

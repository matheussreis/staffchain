import React from 'react';
import { Password } from 'primereact/password';
import FIELD_TYPES from '../../../enums/field-types';

import classes from './Input.module.css';

export default function Input({
  name,
  type = FIELD_TYPES.TEXT,
  useLabel = true,
  label,
  placeholder,
  isSingleLine = false,
  hasError = false,
  errorMessage,
  onChange,
  onBlur,
  value,
  className,
}) {
  const getContainerClasses = () => {
    let containerClasses = classes.container;

    if (isSingleLine) {
      containerClasses += ` ${classes.singleline}`;
    }

    if (hasError) {
      containerClasses += ` ${classes.invalid}`;
    }

    if (className) {
      containerClasses += ` ${className}`;
    }

    return containerClasses;
  };

  const inputHandler = (type) => {
    switch (type) {
      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            name={name}
            placeholder={placeholder}
            rows={5}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          />
        );
      case FIELD_TYPES.PASSWORD:
        return (
          <Password
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            className={classes.password}
            feedback={false}
            toggleMask
          />
        );
      default:
        return (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          />
        );
    }
  };

  return (
    <div className={getContainerClasses()}>
      {useLabel && <label>{(label ??= placeholder)}:</label>}
      {inputHandler(type)}
      {hasError && <p className={classes.error}>{errorMessage}</p>}
    </div>
  );
}

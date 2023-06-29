import React from 'react';
import ReactSelect from 'react-select';
import useWindowDimensions from '../../../hooks/use-window-dimensions';

import classes from './Select.module.css';

export default function Select({
  name,
  label,
  options,
  placeholder,
  isSingleLine,
  onBlur,
  onChange,
  useLabel = true,
  hasError = false,
  errorMessage,
  value,
  className,
  disabled = false,
}) {
  const windowDimensions = useWindowDimensions();

  const selectStyles = {
    placeholder: (styles) => ({
      ...styles,
      fontSize: '12px',
      color: hasError ? 'red' : styles.color,
      fontWeight: hasError ? 400 : 200,
    }),
    option: (styles) => ({
      ...styles,
      fontSize: '0.8rem',
    }),
    valueContainer: (styles) => ({
      ...styles,
      fontSize: '0.8rem',
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: hasError
        ? 'var(--color-error-100)'
        : styles.backgroundColor,
      border: hasError
        ? '1px var(--color-error-300) solid'
        : '1px solid lightgray',
      borderRadius: '8px',
      height: '2.7rem',

      ':hover': {
        ...styles[':hover'],
        color: 'rgb(89, 88, 88)',
        border: hasError
          ? '1px var(--color-error-300) solid'
          : '1px solid lightgray',
        transform: 'scale(1.002)',
      },
    }),
    input: (styles) => ({
      ...styles,
      height: '2.2rem',
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      display: windowDimensions.width < 350 ? 'none' : styles.display,
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      display: windowDimensions.width < 350 ? 'none' : styles.display,
    }),
  };

  const getContainerClasses = () => {
    let containerClasses = classes.container;

    if (isSingleLine) {
      containerClasses += ` ${classes.singleline}`;
    }

    if (className) {
      containerClasses += ` ${className}`;
    }

    return containerClasses;
  };

  return (
    <div className={getContainerClasses()}>
      {useLabel && <label>{(label ??= placeholder)}:</label>}
      <ReactSelect
        isDisabled={disabled}
        styles={selectStyles}
        name={name}
        options={options}
        onBlur={onBlur}
        onChange={onChange}
        value={value}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: 'var(--color-primary-100)',
            primary: 'var(--color-primary-400)',
          },
        })}
      />
      {hasError && <p className={classes.error}>{errorMessage}</p>}
    </div>
  );
}

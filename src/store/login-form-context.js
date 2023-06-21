import React from 'react';

export const LoginFormContext = React.createContext({
  fields: {
    email: {
      value: '',
      isValid: true,
      hasError: false,
      errorMessage: '',
      valueChangeHandler: () => {},
      inputBlurHandler: () => {},
      resetField: () => {},
    },
    password: {
      value: '',
      isValid: true,
      hasError: false,
      errorMessage: '',
      valueChangeHandler: () => {},
      inputBlurHandler: () => {},
      resetField: () => {},
    },
  },
});

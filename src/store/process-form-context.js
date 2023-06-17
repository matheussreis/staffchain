import React from 'react';

export const ProcessFormContext = React.createContext({
  step1: {
    fields: {
      name: {
        value: '',
        isValid: true,
        hasError: false,
        errorMessage: '',
        valueChangeHandler: () => {},
        inputBlurHandler: () => {},
      },
      description: {
        value: '',
        isValid: true,
        hasError: false,
        errorMessage: '',
        valueChangeHandler: () => {},
        inputBlurHandler: () => {},
      },
    },
    isValid: false,
    setIsValid: (isValid) => {},
  },
  step2: {
    processMetadata: {
      fields: [],
      setFields: (fields) => {},
    },
    isValid: false,
    setIsValid: (isValid) => {},
  },
  step3: {
    processUsers: {
      users: [],
      setUsers: (users) => {},
    },
    systemUsers: {
      users: [],
      setUsers: (users) => {},
    },
    isValid: false,
    setIsValid: (isValid) => {},
  },
  step4: {
    requestTree: {
      availableUsers: [],
      setAvailableUsers: (users) => {},
      selectedUsers: {},
      setSelectedUsers: (users) => {},
    },
    isValid: false,
    setIsValid: (isValid) => {},
  },
});

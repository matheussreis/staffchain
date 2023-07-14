import React from 'react';

export const RequestFormContext = React.createContext({
  request: {
    id: '',
    name: '',
    processId: '',
    description: '',
    fields: [],
    status: '',
    comments: [],
    updateComments: (comments) => {},
    starter: { id: '', name: '' },
    reviewer: { id: '', name: '' },
    isValid: true,
    setIsValid: (isValid) => {},
  },
});

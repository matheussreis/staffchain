import React from 'react';

export const RequestFormContext = React.createContext({
  request: {
    id: '',
    name: '',
    description: '',
    fields: [],
    status: '',
    comments: [],
    updateComments: (comments) => {},
    createdBy: { id: '', name: '' },
    assignedTo: { id: '', name: '' },
    isValid: true,
    setIsValid: (isValid) => {},
  },
});

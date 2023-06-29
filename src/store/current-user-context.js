import React from 'react';

export const CurrentUserContext = React.createContext({
  user: {
    id: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    type: '',
    processes: [],
  },
  setUser: (user) => {},
});

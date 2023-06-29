import React from 'react';

export const CurrentUserContext = React.createContext({
  user: {
    id: '',
    firstName: '',
    lastName: '',
    bithdate: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    type: '',
    processes: [],
  },
  setUser: (user) => {},
});

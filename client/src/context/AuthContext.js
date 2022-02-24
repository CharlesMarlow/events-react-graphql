import React from 'react';

export default React.createContext({
  token: '',
  login: (token, userId, tokenExpiration) => {},
  logout: () => {},
  userId: null,
});

import { redirect } from 'react-router';

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  const expirationTime = new Date(storedExpirationDate).getTime();
  const duration = expirationTime - new Date().getTime();
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const tokenDuration = getTokenDuration();
  if (tokenDuration < 0) return 'EXPIRED';

  return token;
}

export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

export function setTokenExpiration() {
  const { REACT_APP_TOKEN_DURATION_HOURS: TOKEN_DURATION } = process.env;
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + parseInt(TOKEN_DURATION));
  localStorage.setItem('expiration', expiration.toISOString());
}

export function checkAuthLoader() {
  const token = getAuthToken();
  if (!token || token === 'EXPIRED') return redirect('/login');
  return null;
}

export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

export function setTokenExpiration() {
  const { REACT_APP_TOKEN_DURATION_HOURS: TOKEN_DURATION } = process.env;
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + parseInt(TOKEN_DURATION));
  localStorage.setItem('expiration', expiration.toISOString());
}

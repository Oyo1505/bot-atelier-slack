export const  isAuthorizedUser = (id) => {
  const userIdForRapport = process.env.NODE_ENV === 'development' ? 'U03GQPE5CV9' : 'U1X0X7NBE';
  const userId = id;

  return userId === userIdForRapport;
}
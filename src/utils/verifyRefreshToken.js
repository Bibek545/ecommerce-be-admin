import jwt from 'jsonwebtoken';


export const verifyRefreshToken = (token) => {
  if(!process.env.JWT_REFRESH_TOKEN) {
    throw new Error("JWT_REFRESH_SECRET is missing");
  }

  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN); //returns the decoded payload
};
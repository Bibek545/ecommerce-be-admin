import jwt from 'jsonwebtoken';

// generating a JWT token
export const generateJWT = (payload) => {
  if(!process.env. JWT_SECRET) {
    throw new Error ("JWT_SECRET can not be found in env")
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', //valid for 1 day
  });
};
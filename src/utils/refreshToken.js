import jwt from 'jsonwebtoken';

export const generateRefreshToken = (payload) => {
   if(!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET can not be found")
   }

   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '3d', //valid for 3 days
   });
};

import jwt from "jsonwebtoken";

export const verifyJwtToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

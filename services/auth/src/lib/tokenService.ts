import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

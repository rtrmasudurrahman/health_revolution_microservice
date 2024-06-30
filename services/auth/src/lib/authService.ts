import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
};

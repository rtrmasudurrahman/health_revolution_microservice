// lib/verificationLib.ts
import prisma from "../prisma";

interface CreateVerificationCodeParams {
  userId: string;
  code: string;
  expiresIn?: number; // Optional expiration time in milliseconds, default is 24 hours
}

export const createVerificationCodeRecord = async ({
  userId,
  code,
  expiresIn = 1000 * 60 * 60 * 24,
}: CreateVerificationCodeParams) => {
  const verificationCode = await prisma.verificationCode.create({
    data: {
      userId,
      code,
      expiresAt: new Date(Date.now() + expiresIn),
    },
  });

  return verificationCode;
};
export const generateVerificationCode = (): string => {
  // Simple example: Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

interface EmailVerificationDTO {
  id: string;
}

export const generateAndStoreVerificationCode = async (
  user: EmailVerificationDTO
) => {
  const code = generateVerificationCode();
  return createVerificationCodeRecord({ userId: user.id, code });
};

// export const generateVerificationCode = (): string => {
//   const timestamp = new Date().getTime().toString();
//   const randomNum = Math.floor(10 + Math.random() * 90);
//   return (timestamp + randomNum).slice(-5);
// };

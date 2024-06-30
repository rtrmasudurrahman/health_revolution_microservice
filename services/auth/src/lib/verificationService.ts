import prisma from "../prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findVerificationCode = async (userId: string, code: string) => {
  return prisma.verificationCode.findFirst({ where: { userId, code } });
};

export const markUserAsVerified = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { verified: true, status: "ACTIVE" },
  });
};

export const markVerificationCodeAsUsed = async (codeId: string) => {
  return prisma.verificationCode.update({
    where: { id: codeId },
    data: { status: "USED", verifiedAt: new Date() },
  });
};

export const updateVerificationCodeStatus = async (
  verificationCodeId: string
) => {
  return await prisma.verificationCode.update({
    where: { id: verificationCodeId },
    data: { status: "USED", verifiedAt: new Date() },
  });
};

import prisma from "../prisma";
import { LoginAttempt } from "@prisma/client";

type LoginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttempt;
};

export const createLoginHistory = async (info: LoginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: info.userId,
      userAgent: info.userAgent,
      ipAddress: info.ipAddress,
      attempt: info.attempt,
    },
  });
};

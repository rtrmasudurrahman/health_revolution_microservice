import prisma from "@/prisma";

export const logEmail = async (emailLog: {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  source: string;
}) => {
  try {
    const result = await prisma.email.create({
      data: emailLog,
    });
    return result;
  } catch (error) {
    console.error("Error logging email to database:", error);
    throw new Error("Database operation failed");
  }
};

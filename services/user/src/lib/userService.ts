import prisma from "@/prisma";
import { UserCreateDTO } from "@/schemas";

export const createUserService = async (data: UserCreateDTO) => {
  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      authUserId: data.authUserId,
    },
  });

  if (existingUser) {
    return { message: "User already exists" };
  }

  // Create the user
  const user = await prisma.user.create({
    data: data,
  });

  return user;
};

// lib/userLib.ts
import { User } from "@prisma/client";

interface GetUserParams {
  id: string;
  field: "id" | "authUserId";
}

export const getUserByField = async ({
  id,
  field,
}: GetUserParams): Promise<User | null> => {
  if (field === "authUserId") {
    return prisma.user.findUnique({ where: { authUserId: id } });
  } else {
    return prisma.user.findUnique({ where: { id } });
  }
};

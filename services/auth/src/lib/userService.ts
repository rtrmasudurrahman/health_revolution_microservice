import axios from "axios";
import { USER_SERVICE } from "../config";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { UserCreateDTO } from "@/schemas";

// create user
export const createUser = async (data: UserCreateDTO) => {
  // hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      verified: true,
    },
  });

  // return user
  return user;
};

export const createUserProfile = async (user: any) => {
  return await axios.post(`${USER_SERVICE}/users`, {
    authUserId: user.id,
    name: user.name,
    email: user.email,
  });
};
// find user by id
export const findUserById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
};
// find user by email
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

//verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

//update status
export const updateUserStatus = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { verified: true, status: "ACTIVE" },
  });
};

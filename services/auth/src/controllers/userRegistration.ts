import { Request, Response, NextFunction } from "express";
import { UserCreateSchema } from "@/schemas";
import { sendVerificationEmail } from "@/lib/emailService";
import {
  createUser,
  createUserProfile,
  findUserByEmail,
} from "@/lib/userService";
import { generateAndStoreVerificationCode } from "@/utils/generateVerificationCode";

const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // req.body validate
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // if user exixts
    const existingUser = await findUserByEmail(parsedBody.data.email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await createUser(parsedBody.data);
    //update user
    await createUserProfile(user);

    // generate verification code
    const userCode = await generateAndStoreVerificationCode(user);

    await sendVerificationEmail(user.email, userCode.code);

    return res.status(201).json({
      message: "User created. Check your email for verification code",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default userRegistration;

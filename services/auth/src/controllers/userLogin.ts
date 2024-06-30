import { Request, Response, NextFunction } from "express";
import { UserLoginSchema } from "@/schemas";
import { findUserByEmail, verifyPassword } from "@/lib/userService";
import { createLoginHistory } from "@/lib/loginHistoryService";
import { generateAccessToken } from "@/lib/authService";

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";

    const parseBody = UserLoginSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    const user = await findUserByEmail(parseBody.data.email);
    if (!user) {
      await createLoginHistory({
        userId: "unknown",
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await verifyPassword(
      parseBody.data.password,
      user.password
    );
    if (!isMatch) {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({ message: "User not verified" });
    }

    if (user.status !== "ACTIVE") {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res
        .status(400)
        .json({ message: `Your account is ${user.status.toLowerCase()}` });
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: "SUCCESS",
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export default userLogin;

// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import prisma from "@/prisma";
// import { UserLoginSchema } from "@/schemas";
// import bcrypt from "bcryptjs";
// import { LoginAttempt } from "@prisma/client";

// type LoginHistory = {
//   userId: string;
//   userAgent: string | undefined;
//   ipAddress: string | undefined;
//   attempt: LoginAttempt;
// };

// const createLoginHistory = async (info: LoginHistory) => {
//   await prisma.loginHistory.create({
//     data: {
//       userId: info.userId,
//       userAgent: info.userAgent,
//       ipAddress: info.ipAddress,
//       attempt: info.attempt,
//     },
//   });
// };

// const userLogin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const ipAddress =
//       (req.headers["x-forwarded-for"] as string) || req.ip || "";
//     const userAgent = req.headers["user-agent"] || "";

//     // validate the request body
//     const parseBody = UserLoginSchema.safeParse(req.body);
//     if (!parseBody.success) {
//       return res.status(400).json({ errors: parseBody.error.errors });
//     }
//     // check if the user exists
//     const user = await prisma.user.findUnique({
//       where: {
//         email: parseBody.data.email,
//       },
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // compare password
//     const isMatch = await bcrypt.compare(
//       parseBody.data.password,
//       user.password
//     );
//     if (!isMatch) {
//       await createLoginHistory({
//         userId: user.id,
//         userAgent,
//         ipAddress,
//         attempt: "FAILED",
//       });
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // check if the user is verified
//     if (!user.verified) {
//       await createLoginHistory({
//         userId: user.id,
//         userAgent,
//         ipAddress,
//         attempt: "FAILED",
//       });
//       return res.status(400).json({ message: "user not verified" });
//     }

//     //check if the account is active
//     if (user.status !== "ACTIVE") {
//       await createLoginHistory({
//         userId: user.id,
//         userAgent,
//         ipAddress,
//         attempt: "FAILED",
//       });
//       return res
//         .status(400)
//         .json({ message: `Your account is ${user.status.toLowerCase()}` });
//     }

//     // generate access token

//     const accessToken = jwt.sign(
//       { userId: user.id, email: user.email, name: user.name, role: user.role },
//       process.env.JWT_SECRET ?? "My_Secret_Key",
//       { expiresIn: "2h" }
//     );
//     await createLoginHistory({
//       userId: user.id,
//       userAgent,
//       ipAddress,
//       attempt: "SUCCESS",
//     });
//     return res.status(200).json({ accessToken });
//   } catch (err) {
//     next(err);
//   }
// };

// export default userLogin;

import { Request, Response, NextFunction } from "express";
import { createUserService } from "@/lib/userService";
import { UserCreateSchema } from "@/schemas";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate request body
    const parsedBody = UserCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(404).json({ error: parsedBody.error.errors });
    }

    // create user
    const user = await createUserService(parsedBody.data);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export default createUser;

// import prisma from "@/prisma";
// import { NextFunction, Request, Response } from "express";
// import { UserCreateSchema } from "@/schemas";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Validate request body
//     const parsedBody = UserCreateSchema.safeParse(req.body);
//     if (!parsedBody.success) {
//       return res.status(400).json({
//         message: parsedBody.error.errors,
//       });
//     }

//     // check if product with the same sku already exists
//     const existingUser = await prisma.user.findUnique({
//       where: {
//         authUserId: parsedBody.data.authUserId,
//       },
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create user
//     const user = await prisma.user.create({
//       data: parsedBody.data,
//     });
//     console.log("User created successfully", user.id);

//     return res.status(201).json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// export default createUser;

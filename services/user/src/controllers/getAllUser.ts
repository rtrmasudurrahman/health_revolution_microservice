import { getAllUserService } from "@/lib/getAllUser";
import { PaginationSchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";

export const geAlltUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // validate the query params
    const pagination = PaginationSchema.safeParse(req.query);

    // if validation fails, return an error
    if (!pagination.success) {
      return res.status(400).json({ errors: pagination.error.errors });
    }

    // get all tickets
    const users = await getAllUserService(pagination.data);

    // generate response
    const response = {
      code: 200,
      status: "success",
      message: "users retrieved successfully",
      data: users,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default geAlltUsers;

import { getAllTodosService } from "@/lib/getAllTodosService";
import { GetTodosQuerySchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";

const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate the request
    const parsedBody = GetTodosQuerySchema.safeParse(req.body);

    // if validation fails, return an error
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // get all todos
    const todos = await getAllTodosService(parsedBody.data);

    // generate response
    const response = {
      code: 200,
      status: "success",
      message: "Todos retrieved successfully",
      data: todos,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default getAllTodos;

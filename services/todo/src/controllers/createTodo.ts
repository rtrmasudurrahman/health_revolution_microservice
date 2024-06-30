import { Request, Response, NextFunction } from "express";
import { TodoSchema } from "@/schemas";
import { createTodoService } from "@/lib/createTodoService";

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedTodo = TodoSchema.safeParse(req.body);

    if (!parsedTodo.success) {
      return res.status(400).json({ error: "Invalid todo data" });
    }

    const newTodo = await createTodoService(req.params.id, parsedTodo.data);

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export default createTodo;

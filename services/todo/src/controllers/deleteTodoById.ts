import { deleteTodotById } from "@/lib/deleteTodoByIdServices";
import { Request, Response, NextFunction } from "express";

const deleteTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = req.params.id;

    const deleteTodo = await deleteTodotById(todoId);

    res.status(200).json(deleteTodo);
  } catch (err) {
    next(err);
  }
};

export default deleteTodoById;

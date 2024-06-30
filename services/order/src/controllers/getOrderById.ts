import { Request, Response, NextFunction } from "express";
import { getOrderByIdService } from "@/lib/getOrderByIdService";

const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await getOrderByIdService(req.params.id);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export default getOrderById;

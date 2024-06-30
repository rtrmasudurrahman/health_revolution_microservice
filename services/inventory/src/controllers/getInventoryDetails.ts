import { Request, Response, NextFunction } from "express";
import { getInventoryById } from "@/lib/getInventoryDetailService";

const getInventoryDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const inventory = await getInventoryById(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    return res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
};

export default getInventoryDetails;

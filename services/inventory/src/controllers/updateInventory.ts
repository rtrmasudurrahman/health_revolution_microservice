import { Request, Response, NextFunction } from "express";
import { updateInventoryService } from "@/lib/updateInventoryService";
import { InventoryUpdateDTOSchema } from "@/schemas";

const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validate request body
    const parsedBody = InventoryUpdateDTOSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ message: "Inventory not found!" });
    }
    // get id from request params
    const { id } = req.params;
    // update Inventory
    const updatedInventory = await updateInventoryService(id, parsedBody.data);

    return res.status(200).json(updatedInventory);
  } catch (error) {
    next(error);
  }
};

export default updateInventory;

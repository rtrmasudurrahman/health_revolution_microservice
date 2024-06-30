import prisma from "@/prisma";
import { Request, Response, NextFunction } from "express";

const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id; // Assuming the ID is passed as a route parameter

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If the product exists, delete it
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default deleteProductById;

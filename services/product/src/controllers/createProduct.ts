import { Request, Response, NextFunction } from "express";
import { createProductService } from "@/lib/createProductService";
import { ProductCreateDTOSchema } from "@/schemas";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const parsedBody = ProductCreateDTOSchema.safeParse(req.body);
    // if validation fails, return an error
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    const product = await createProductService(parsedBody.data);

    return res.status(201).json({ ...product });
  } catch (error) {
    next(error);
  }
};

export default createProduct;

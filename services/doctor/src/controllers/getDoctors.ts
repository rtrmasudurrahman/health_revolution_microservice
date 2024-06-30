import { getAllDoctorService } from "@/lib/getAllDcotorService";
import { PaginationSchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";

export const getDoctors = async (
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
    const doctors = await getAllDoctorService(pagination.data);

    // generate response
    const response = {
      code: 200,
      status: "success",
      message: "doctors retrieved successfully",
      data: doctors,
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default getDoctors;
// import prisma from "@/prisma";
// import { Request, Response, NextFunction } from "express";

// const getProducts = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const products = await prisma.product.findMany({
//       select: {
//         id: true,
//         sku: true,
//         name: true,
//         price: true,
//         inventoryId: true,
//       },
//     });

//     // TODO: Implement pagination
//     // TODO: Implement filtering

//     res.json({ data: products });
//   } catch (err) {
//     next(err);
//   }
// };

// export default getProducts;

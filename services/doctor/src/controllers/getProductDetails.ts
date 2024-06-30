import { Request, Response, NextFunction } from "express";
import { getProductDetailsService } from "@/lib/getProductDetailsService";

/**
 * Express controller to handle fetching product details and managing inventory.
 *
 * @param {Request} req - The request object from Express, expected to contain the product ID in the parameters.
 * @param {Response} res - The response object from Express.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 *
 * @returns {Promise<void>} A promise that resolves when the product details are fetched or an error occurs.
 */
const getProductDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const productDetails = await getProductDetailsService(id);

    res.status(200).json(productDetails);
  } catch (err) {
    next(err);
  }
};

export default getProductDetails;

// import { Request, Response, NextFunction } from "express";
// import prisma from "@/prisma";
// import axios from "axios";
// import { INVENTORY_URL } from "@/config";

// const getProductDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { id } = req.params;
//     const product = await prisma.product.findUnique({
//       where: { id },
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product.inventoryId === null) {
//       const { data: inventory } = await axios.post(
//         `${INVENTORY_URL}/inventories`,
//         {
//           productId: product.id,
//           sku: product.sku,
//         }
//       );
//       console.log("Inventory created successfully", inventory.id);

//       await prisma.product.update({
//         where: { id: product.id },
//         data: {
//           inventoryId: inventory.id,
//         },
//       });
//       console.log(
//         "Product updated successfully with inventory id",
//         inventory.id
//       );

//       return res.status(200).json({
//         ...product,
//         inventoryId: inventory.id,
//         stock: inventory.quantity || 0,
//         stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
//       });
//     }

//     // fetch inventory
//     const { data: inventory } = await axios.get(
//       `${INVENTORY_URL}/inventories/${product.inventoryId}`
//     );

//     return res.status(200).json({
//       ...product,
//       stock: inventory.quantity || 0,
//       stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export default getProductDetails;

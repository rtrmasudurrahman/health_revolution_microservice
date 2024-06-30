import { z } from "zod";

// Defining the schema for a cart item using zod
export const CartItemSchema = z.object({
  productId: z.string(),
  inventoryId: z.string(),
  quantity: z.number(),
});

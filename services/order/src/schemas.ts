// Importing the z object from the zod library for schema validation
import { z } from "zod";

// Defining the schema for an order using zod
export const OrderSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  cartSessionId: z.string(),
});

// Creating a type alias for the OrderSchema inferred type
export type OrderDTO = z.infer<typeof OrderSchema>;

// Defining the schema for a cart item using zod
export const CartItemSchema = z.object({
  productId: z.string(),
  inventoryId: z.string(),
  quantity: z.number(),
});

// Creating a type alias for the CartItemSchema inferred type
export type CartItemDTO = z.infer<typeof CartItemSchema>;

// Defining the schema for creating an email using zod
export const EmailCreateSchema = z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
  source: z.string(),
  sender: z.string().email().optional(),
});

// Creating a type alias for the EmailCreateSchema inferred type
export type EmailCreateDTO = z.infer<typeof EmailCreateSchema>;

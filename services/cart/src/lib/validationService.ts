import { CartItemSchema } from "@/schemas";

export const validateCartItem = (data: any) => {
  return CartItemSchema.safeParse(data);
};

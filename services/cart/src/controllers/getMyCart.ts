import { Request, Response, NextFunction } from "express";
import { sessionExists, deleteSessionCart } from "@/lib/sessionService";
import { getCartItems, formatCartItems } from "@/lib/cartService";

// Handler function to get the cart items
const getMyCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the cart session ID from the request headers
    const cartSessionId = (req.headers["x-cart-session-id"] as string) || null;

    // If no cart session ID is provided, respond with an empty data array
    if (!cartSessionId) {
      return res.status(200).json({ data: [] });
    }

    // Check if the session ID exists in the store
    const session = await sessionExists(cartSessionId);
    if (!session) {
      // If the session does not exist, delete the session cart and respond with an empty data array
      await deleteSessionCart(cartSessionId);
      return res.status(200).json({ data: [] });
    }

    // Get the items in the cart
    const items = await getCartItems(cartSessionId);
    if (Object.keys(items).length === 0) {
      // If the cart is empty, respond with an empty data array
      return res.status(200).json({ data: [] });
    }

    // Format the cart items
    const formattedItems = formatCartItems(items);

    // Respond with the formatted items
    res.status(200).json({ items: formattedItems });
  } catch (error) {
    // Pass any errors to the next middleware function for error handling
    next(error);
  }
};

// Export the getMyCartHandler function as the default export
export default getMyCartHandler;

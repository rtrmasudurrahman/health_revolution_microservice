import { Request, Response, NextFunction } from "express";
import { sessionExists, deleteSession } from "@/lib/sessionService";

import { clearCart } from "@/lib/clearCartService";

// Handler function to clear the cart
const clearCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the cart session ID from the request headers
    const cartSessionId = (req.headers["x-cart-session-id"] as string) || null;

    // If no cart session ID is provided, respond with a message indicating the cart is empty
    if (!cartSessionId) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    // Check if the session ID exists in the store
    const exists = await sessionExists(cartSessionId);
    if (!exists) {
      // If the session ID does not exist, remove it from the headers and respond with a message indicating the cart is empty
      delete req.headers["x-cart-session-id"];
      return res.status(200).json({ message: "Cart is empty" });
    }

    // Clear the cart and delete the session
    await clearCart(cartSessionId);
    await deleteSession(cartSessionId);

    // Remove the session ID from the headers
    delete req.headers["x-cart-session-id"];

    // Respond with a message indicating the cart has been cleared
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    // Pass any errors to the next middleware function for error handling
    next(error);
  }
};

export default clearCartHandler;

import { Request, Response, NextFunction } from "express";
import { OrderSchema, CartItemSchema } from "@/schemas";
import { getCartDetails, clearCart } from "@/lib/cartService";
import { getProductDetails } from "@/lib/productService";
import { sendEmail } from "@/lib/emailService";
import { createOrder } from "@/lib/orderService";
import { z } from "zod";
import sendToQueue from "@/queue";

const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against the OrderSchema
    const parsedBody = OrderSchema.safeParse(req.body);

    // If validation fails, return a 400 response with the validation errors
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // Retrieve cart details using the cart session ID from the request body
    const { data: cartData } = await getCartDetails(
      parsedBody.data.cartSessionId
    );

    // // Validate the items in the cart against the CartItemSchema
    const cartItems = z.array(CartItemSchema).safeParse(cartData.items);
    if (!cartItems.success) {
      // If validation fails, return a 404 response indicating the cart session ID was not found
      return res.status(404).json({ message: "cartSessionId not found!" });
    }

    // Check if the cart is empty, and if so, return a 400 response
    if (cartItems.data.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch detailed information for each product in the cart
    const productDetails = await Promise.all(
      cartItems.data.map(async item => {
        const { data: product } = await getProductDetails(item.productId);
        return {
          productId: product.id as string,
          productName: product.name as string,
          sku: product.sku as string,
          price: product.price as number,
          quantity: item.quantity,
          total: product.price * item.quantity,
        };
      })
    );

    // Calculate the subtotal for the cart
    const subtotal = productDetails.reduce((acc, item) => acc + item.total, 0);

    // Placeholder for tax calculation, currently set to 0
    const tax = 0;
    // Calculate the grand total by adding the subtotal and tax
    const grandTotal = subtotal + tax;

    // Prepare the data needed to create an order
    const orderData = {
      userId: parsedBody.data.userId,
      userName: parsedBody.data.userName,
      userEmail: parsedBody.data.userEmail,
      subtotal,
      tax,
      grandTotal,
      orderItems: {
        create: productDetails,
      },
    };

    // Create a new order using the order data
    const order = await createOrder(orderData);

    // Clear the cart for the given cart session ID
    await clearCart(parsedBody.data.cartSessionId);

    // Send a confirmation email to the user
    await sendEmail({
      recipient: parsedBody.data.userEmail,
      subject: "Order Confirmation",
      body: `Thank you for your order. Your order id is ${order.id}. Your order total is $${grandTotal}`,
      source: "Checkout",
    });

    // Enqueue messages for sending an email and clearing the cart
    sendToQueue("send-email", JSON.stringify(order));
    sendToQueue(
      "clear-cart",
      JSON.stringify({ cartSessionId: parsedBody.data.cartSessionId })
    );

    // Return the created order in the response with a 201 status
    return res.status(201).json(order);
  } catch (error) {
    // Pass any errors to the next error handling middleware
    next(error);
  }
};

export default checkout;

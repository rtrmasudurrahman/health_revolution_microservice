import { Request, Response, NextFunction } from "express";
import { OrderSchema, CartItemSchema } from "@/schemas";
import { getCartDetails, clearCart } from "@/lib/cartService";
import { sendEmail } from "@/lib/emailService";
import { createOrder } from "@/lib/orderService";
import { z } from "zod";
import { getDoctorDetails } from "@/lib/doctorService";
import sendToQueue from "@/queue";

const checkoutDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request
    const parsedBody = OrderSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors });
    }

    // Get cart details
    const { data: cartData } = await getCartDetails(
      parsedBody.data.cartSessionId
    );
    const cartItems = z.array(CartItemSchema).safeParse(cartData.items);
    if (!cartItems.success) {
      return res.status(400).json({ errors: cartItems.error.errors });
    }

    if (cartItems.data.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get product details from cart items
    const doctorDetails = await Promise.all(
      cartItems.data.map(async item => {
        const { data: doctor } = await getDoctorDetails(item.productId);
        return {
          productId: doctor.id as string,
          productName: doctor.name as string,
          sku: doctor.sku as string,
          price: doctor.price as number,
          quantity: item.quantity,
          total: doctor.price * item.quantity,
        };
      })
    );

    const subtotal = doctorDetails.reduce((acc, item) => acc + item.total, 0);

    // Handle tax calculation (placeholder)
    const tax = 0;
    const grandTotal = subtotal + tax;

    // Create order
    const orderData = {
      userId: parsedBody.data.userId,
      userName: parsedBody.data.userName,
      userEmail: parsedBody.data.userEmail,
      subtotal,
      tax,
      grandTotal,
      orderItems: {
        create: doctorDetails,
      },
    };
    const order = await createOrder(orderData);

    // Clear cart
    await clearCart(parsedBody.data.cartSessionId);

    // Send email
    await sendEmail({
      recipient: parsedBody.data.userEmail,
      subject: "Order Confirmation",
      body: `Thank you for your order. Your order id is ${order.id}. Your order total is $${grandTotal}`,
      source: "Checkout",
    });

    // Send to queue
    sendToQueue("send-email", JSON.stringify(order));
    sendToQueue(
      "clear-cart",
      JSON.stringify({ cartSessionId: parsedBody.data.cartSessionId })
    );

    return res.status(201).json({ ...order });
  } catch (error) {
    next(error);
  }
};
export default checkoutDoctor;

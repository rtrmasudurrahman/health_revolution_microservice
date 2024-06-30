import prisma from "@/prisma";
import { OrderDTO } from "@/schemas";

export const getOrderByIdService = (orderId: string) => {
  // const id = orderId.userId;
  try {
    const order = prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.log(error);
  }
};

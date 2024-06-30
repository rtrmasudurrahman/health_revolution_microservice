import prisma from "@/prisma";

export const createOrder = async (orderData: any) => {
  return prisma.order.create({
    data: orderData,
  });
};

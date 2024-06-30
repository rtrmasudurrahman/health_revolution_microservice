import prisma from "@/prisma";

export const deleteProductById = async (productId: string) => {
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  // If the product exists, delete it
  await prisma.product.delete({
    where: { id: productId },
  });

  return { message: "Product deleted successfully" };
};

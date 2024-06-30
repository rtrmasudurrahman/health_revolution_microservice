import prisma from "@/prisma";

export const deleteProductById = async (doctorId: string) => {
  // Check if the product exists
  const existingProduct = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!existingProduct) {
    throw new Error("Doctor not found");
  }

  // If the product exists, delete it
  await prisma.doctor.delete({
    where: { id: doctorId },
  });

  return { data: existingProduct, message: "Doctor deleted successfully" };
};

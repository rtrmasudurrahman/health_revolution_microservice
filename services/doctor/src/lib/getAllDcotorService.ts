import prisma from "@/prisma";
import { Pagination } from "@/schemas";

// get tickets
export const getAllDoctorService = async (pagination: Pagination) => {
  return prisma.doctor.findMany({
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
    orderBy: {
      [pagination.orderBy]: pagination.order,
    },
    where: {
      OR: [
        {
          name: {
            contains: pagination.search || "",
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: pagination.search || "",
            mode: "insensitive",
          },
        },
      ],
    },
    select: pagination?.fields?.split(",")?.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}),
  });
};

// import prisma from "@/prisma";

// export const getAllProducts = async () => {
//   try {
//     const products = await prisma.product.findMany({
//       select: {
//         id: true,
//         sku: true,
//         name: true,
//         price: true,
//         inventoryId: true,
//       },
//     });
//     return products;
//   } catch (error) {
//     console.log(error);
//   }
// };

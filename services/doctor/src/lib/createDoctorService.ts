// src/services/productService.ts
import prisma from "@/prisma";
import axios from "axios";
import { INVENTORY_URL } from "@/config";
import { DoctorCreateDTO } from "@/schemas";

export const createDoctorService = async (doctorData: DoctorCreateDTO) => {
  try {
    // Check if product with the same sku already exists
    const existingProduct = await prisma.doctor.findFirst({
      where: {
        sku: doctorData.sku,
      },
    });

    if (existingProduct) {
      return { message: "Doctor with the same sku already exists" };
    }

    // Create product
    const doctor = await prisma.doctor.create({
      data: doctorData,
    });
    console.log("Doctor created successfully", doctor.id);

    // Create inventory record for the product
    const { data: inventory } = await axios.post(
      `${INVENTORY_URL}/inventories`,
      {
        productId: doctor.id,
        sku: doctor.sku,
      }
    );
    console.log("Inventory created successfully", inventory.id);

    // Update product and store inventory id
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        inventoryId: inventory.id,
      },
    });
    console.log("Dcotor updated successfully with inventory id", inventory.id);
    const response = {
      code: 201,
      status: "success",
      message: "Doctor created successfully",
      data: doctor,
      inventoryId: inventory.id,
    };
    return response;
    1;
  } catch (error) {
    throw error;
  }
};

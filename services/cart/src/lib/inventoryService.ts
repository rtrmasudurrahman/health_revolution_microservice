import axios from "axios";
import { INVENTORY_SERVICE } from "@/config";

// Function to check the inventory for a given inventory ID
export const checkInventory = async (inventoryId: string) => {
  // Making a GET request to the inventory service to get inventory details
  const { data } = await axios.get(
    `${INVENTORY_SERVICE}/inventories/${inventoryId}`
  );
  // Returning the retrieved inventory data
  return data;
};

// Function to update the inventory for a given inventory ID and quantity
export const updateInventory = async (
  inventoryId: string,
  quantity: number
) => {
  // Making a PUT request to the inventory service to update the inventory quantity
  await axios.put(`${INVENTORY_SERVICE}/inventories/${inventoryId}`, {
    quantity,
    actionType: "OUT",
  });
};

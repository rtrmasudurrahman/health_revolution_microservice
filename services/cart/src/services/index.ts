import { INVENTORY_SERVICE } from "@/config";
import redis from "@/redis";
import axios from "axios";

// Function to clear the cart for a given user ID
export const clearCart = async (id: string) => {
  try {
    // Fetching all the items in the cart for the given user ID
    const data = await redis.hgetall(`cart:${id}`);

    // If the cart is empty, return early
    if (Object.keys(data).length === 0) {
      return;
    }

    // Mapping the cart items to an array of objects with inventoryId, quantity, and productId
    const items = Object.keys(data).map(key => {
      const { quantity, inventoryId } = JSON.parse(data[key]) as {
        inventoryId: string;
        quantity: number;
      };
      return {
        inventoryId,
        quantity,
        productId: key,
      };
    });

    // Creating an array of promises to update the inventory for each item
    const requests = items.map(item => {
      return axios.put(`${INVENTORY_SERVICE}/inventories/${item.inventoryId}`, {
        quantity: item.quantity,
        actionType: "IN",
      });
    });

    // Executing all the inventory update requests in parallel
    Promise.all(requests);
    console.log("Inventory updated");

    // Clearing the cart by deleting the key from Redis
    await redis.del(`cart:${id}`);
  } catch (error) {
    // Logging any errors that occur during the process
    console.log(error);
  }
};

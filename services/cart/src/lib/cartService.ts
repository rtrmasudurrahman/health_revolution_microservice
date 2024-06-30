import redis from "@/redis";

// Function to add an item to the cart
export const addItemToCart = async (
  sessionId: string,
  productId: string,
  itemData: object
) => {
  // Add the item to the cart in Redis by setting the hash value for the given product ID
  await redis.hset(`cart:${sessionId}`, productId, JSON.stringify(itemData));
};

// Function to get all items from the cart
export const getCartItems = async (sessionId: string) => {
  // Retrieve all items from the cart in Redis
  return await redis.hgetall(`cart:${sessionId}`);
};

// Function to format the cart items
export const formatCartItems = (items: { [key: string]: string }) => {
  // Map over the cart items and return an array of formatted items
  return Object.keys(items).map(key => {
    // Parse the item data from JSON string
    const { quantity, inventoryId } = JSON.parse(items[key]) as {
      inventoryId: string;
      quantity: number;
    };
    return {
      inventoryId, // The inventory ID of the item
      quantity, // The quantity of the item
      productId: key, // The product ID of the item
    };
  });
};

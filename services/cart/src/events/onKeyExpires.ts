import { REDIS_HOST, REDIS_PORT } from "@/config";
import { clearCart } from "@/services";
import { Redis } from "ioredis";

// Creating a new Redis client instance with the specified host and port
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

// Defining the Redis channel key for expired events
const CHANNEL_KEY = "__keyevent@0__:expired";

// Configuring Redis to notify on keyspace events for expired keys
redis.config("SET", "notify-keyspace-events", "Ex");

// Subscribing to the channel for expired key events
redis.subscribe(CHANNEL_KEY);

// Listening for messages on the subscribed channel
redis.on("message", async (ch, message) => {
  if (ch === CHANNEL_KEY) {
    console.log("Key expired: ", message);

    // Extracting the cart key from the message
    const cartKey = message.split(":").pop();
    if (!cartKey) return;

    // Clearing the cart for the expired key
    clearCart(cartKey);
  }
});

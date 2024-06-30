import redis from "@/redis";
import { CART_TTL } from "@/config";
import { v4 as uuid } from "uuid";

// Function to get a session ID, either from the header or by creating a new one
export const getSessionId = async (headerSessionId: string | null) => {
  if (headerSessionId) {
    // Check if the session ID from the header exists in Redis
    const exists = await redis.exists(`sessions:${headerSessionId}`);
    if (exists) {
      return headerSessionId; // Return the existing session ID if it exists
    }
  }

  // Generate a new session ID using uuid
  const newSessionId = uuid();

  // Store the new session ID in Redis with a time-to-live (TTL)
  await redis.setex(`sessions:${newSessionId}`, CART_TTL, newSessionId);
  return newSessionId; // Return the new session ID
};

// Function to check if a session exists in Redis
export const sessionExists = async (sessionId: string) => {
  return await redis.exists(`sessions:${sessionId}`);
};

// Function to delete a session from Redis
export const deleteSession = async (sessionId: string) => {
  await redis.del(`sessions:${sessionId}`);
};

// Function to delete a cart associated with a session from Redis
export const deleteSessionCart = async (sessionId: string) => {
  await redis.del(`cart:${sessionId}`);
};

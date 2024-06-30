import redis from "@/redis";

export const clearCart = async (sessionId: string) => {
  await redis.del(`cart:${sessionId}`);
};

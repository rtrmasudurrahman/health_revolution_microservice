import amqp from "amqplib";
import redis from "./redis";

// Define an asynchronous function to receive messages from a specified queue
const receiveFromQueue = async (
  queue: string,
  callback: (message: string) => void
) => {
  // Create a connection to the RabbitMQ server
  const connection = await amqp.connect("amqp://localhost");
  // Create a channel for communication
  const channel = await connection.createChannel();

  // Define the exchange name
  const exchange = "order";
  // Assert that the exchange exists and is of type 'direct'
  await channel.assertExchange(exchange, "direct", { durable: true });

  // Assert that the specified queue exists and is durable
  const q = await channel.assertQueue(queue, { durable: true });

  // Bind the queue to the exchange with the specified routing key (queue name)
  await channel.bindQueue(q.queue, exchange, queue);

  // Start consuming messages from the queue
  channel.consume(
    q.queue,
    msg => {
      if (msg) {
        // Call the callback function with the message content if a message is received
        callback(msg.content.toString());
      }
    },
    { noAck: true } // Automatically acknowledge receipt of messages
  );
};

// Use the receiveFromQueue function to listen to the 'clear-cart' queue
receiveFromQueue("clear-cart", msg => {
  console.log(`Received clear-cart: ${msg}`);

  // Parse the received message as JSON
  const parsedMessage = JSON.parse(msg);

  // Extract the cart session ID from the parsed message
  const cartSessionId = parsedMessage.cartSessionId;

  // Delete the session and cart data from Redis
  redis.del(`session:${cartSessionId}`);
  redis.del(`cart:${cartSessionId}`);

  // Log that the cart has been cleared
  console.log(`Cart cleared`);
});

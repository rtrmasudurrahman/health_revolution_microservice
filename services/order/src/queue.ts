import amqp from "amqplib";
import { QUEUE_URL } from "./config";

// Define an asynchronous function to send a message to a specified queue
const sendToQueue = async (queue: string, message: string) => {
  // Establish a connection to the RabbitMQ server using the QUEUE_URL
  const connection = await amqp.connect(QUEUE_URL);

  // Create a channel within the connection
  const channel = await connection.createChannel();

  // Define the name of the exchange
  const exchange = "order";

  // Assert an exchange of type 'direct' to ensure it exists
  // 'durable: true' ensures the exchange will survive server restarts
  await channel.assertExchange(exchange, "direct", { durable: true });

  // Publish the message to the specified queue through the exchange
  channel.publish(exchange, queue, Buffer.from(message));
  console.log(`Sent ${message} to ${queue}`);

  // Close the connection after a short delay (500 ms) to ensure the message is sent
  setTimeout(() => {
    connection.close();
  }, 500);
};

// Export the sendToQueue function as the default export of this module
export default sendToQueue;

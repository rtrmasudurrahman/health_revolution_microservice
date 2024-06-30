import amqp from "amqplib";

// Export the receiveFromQueue function
export const receiveFromQueue = async (
  queue: string,
  callback: (message: string) => void
) => {
  try {
    // Establish a connection to the AMQP server
    const connection = await amqp.connect("amqp://localhost");

    // Create a channel
    const channel = await connection.createChannel();

    // Declare the exchange and set its type to 'direct' with durability
    const exchange = "order";
    await channel.assertExchange(exchange, "direct", { durable: true });

    // Declare the queue with durability
    const q = await channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key being the queue name
    await channel.bindQueue(q.queue, exchange, queue);

    // Consume messages from the queue
    channel.consume(
      q.queue,
      msg => {
        if (msg) {
          // Call the callback function with the message content as a string
          callback(msg.content.toString());
        }
      },
      { noAck: true } // Automatically acknowledge messages
    );
  } catch (error) {
    // Log any errors that occur during the connection or consumption process
    console.error("Error in AMQP connection or queue consumption:", error);
  }
};

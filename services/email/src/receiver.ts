// Import necessary utilities and configurations
import { receiveFromQueue } from "@/utils/amqpUtils";
import { sendEmail } from "@/utils/emailUtils";
import { logEmail } from "@/utils/logUtils";
import { defaultSender } from "./config";

// Asynchronous function to process emails from the queue
const processEmailQueue = async () => {
  // Wait for messages from the 'send-email' queue
  await receiveFromQueue("send-email", async msg => {
    try {
      // Parse the message body to get email details
      const parsedBody = JSON.parse(msg);

      // Destructure the necessary fields from the parsed message body
      const { userEmail, grandTotal, id } = parsedBody;
      const subject = "Order Confirmation";
      const body = `Thank you for your order. Your order id is ${id}. Your order total is $${grandTotal}`;

      // Send the email to the user
      await sendEmail({ recipient: userEmail, subject, body });

      // Log the sent email details to the database
      await logEmail({
        sender: defaultSender,
        recipient: userEmail,
        subject,
        body,
        source: "OrderConfirmation",
      });
    } catch (error) {
      // Log any errors that occur during the email processing
      console.error("Error processing email message:", error);
    }
  });
};

// Call the function to start processing the email queue and log any unhandled errors
processEmailQueue().catch(console.error);

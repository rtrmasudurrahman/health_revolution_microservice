import prisma from "../prisma";

// Export the logEmail function
export const logEmail = async ({
  sender,
  recipient,
  subject,
  body,
  source,
}: {
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  source: string;
}) => {
  try {
    // Create a new record in the email table
    const result = await prisma.email.create({
      data: { sender, recipient, subject, body, source }, // Data to be inserted
    });
    console.log("Email logged successfully:", result); // Log success message
    return result; // Return the result
  } catch (error) {
    console.error("Error logging email to database:", error); // Log any errors that occur during logging
    throw new Error("Database logging failed"); // Throw an error if logging fails
  }
};

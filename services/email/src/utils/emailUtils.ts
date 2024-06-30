import { transporter, defaultSender } from "../config"; // Import the email transporter and default sender configuration

// Export the sendEmail function
export const sendEmail = async ({
  recipient,
  subject,
  body,
  sender = defaultSender,
}: {
  recipient: string;
  subject: string;
  body: string;
  sender?: string;
}) => {
  // Email options
  const emailOption = {
    from: sender,
    to: recipient,
    subject,
    text: body,
  };

  try {
    // Send the email using the transporter
    const result = await transporter.sendMail(emailOption);

    // Check if any email addresses were rejected
    if (result.rejected.length) {
      console.error("Email rejected:", result.rejected);
      throw new Error("Email rejected");
    }

    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

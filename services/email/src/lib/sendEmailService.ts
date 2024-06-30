import { transporter, defaultSender } from "@/config";
import { EmailCreateDTO } from "@/schemas";

export const sendEmailService = async (emailOptions: EmailCreateDTO) => {
  const { sender, recipient, subject, body, source } = emailOptions;
  const from = sender || defaultSender;

  const emailOption = {
    from,
    to: recipient,
    subject,
    text: body,
    source,
  };

  try {
    const result = await transporter.sendMail(emailOption);
    if (result.rejected.length) {
      throw new Error(`Email rejected: ${result.rejected}`);
    }
    return {
      from,
      recipient,
      subject,
      body,
      source,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

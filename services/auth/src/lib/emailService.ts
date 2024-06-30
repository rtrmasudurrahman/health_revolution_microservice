import axios from "axios";
import { EMAIL_SERVICE } from "../config";

export const sendVerificationEmail = async (email: string, code: string) => {
  await axios.post(`${EMAIL_SERVICE}/emails/send`, {
    recipient: email,
    subject: "Email Verification",
    body: `Your verification code is ${code}`,
    source: "user-registration",
  });
};

export const sendEmail = async (
  recipient: string,
  subject: string,
  body: string,
  source: string
) => {
  await axios.post(`${EMAIL_SERVICE}/emails/send`, {
    recipient,
    subject,
    body,
    source,
  });
};

export const sendVerificationSuccessEmail = async (recipient: string) => {
  return await axios.post(`${EMAIL_SERVICE}/emails/send`, {
    recipient,
    subject: "Email Verified",
    body: "Your email has been verified successfully",
    source: "verify-email",
  });
};

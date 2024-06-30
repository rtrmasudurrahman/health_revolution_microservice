import axios from "axios";
import { EMAIL_SERVICE } from "@/config";
import { EmailCreateDTO } from "@/schemas";

export const sendEmail = async (emailData: EmailCreateDTO) => {
  return axios.post(`${EMAIL_SERVICE}/emails/send`, emailData);
};

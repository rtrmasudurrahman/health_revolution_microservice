import { Request, Response, NextFunction } from "express";
import { EmailCreateSchema } from "@/schemas";
import { sendEmailService } from "@/lib/sendEmailService";
import { logEmail } from "@/lib/databaseService";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parseBody = EmailCreateSchema.safeParse(req.body);
    if (!parseBody.success) {
      console.error("Validation errors:", parseBody.error.errors);
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    // Send the email
    const emailData = await sendEmailService(parseBody.data);

    // Log the email in the database
    const logResult = await logEmail({
      sender: emailData.from,
      recipient: emailData.recipient,
      subject: emailData.subject,
      body: emailData.body,
      source: emailData.source,
    });

    console.log("Email logged successfully:", logResult);

    return res
      .status(200)
      .json({ message: "Email sent and logged successfully" });
  } catch (error) {
    console.error("Error in sendEmailHandler:", error);
    next(error);
  }
};

export default sendEmail;

// import { Request, Response, NextFunction } from "express";
// import prisma from "@/prisma";
// import { EmailCreateSchema } from "@/schemas";
// import { defaultSender, transporter } from "@/config";

// const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     //validaye the request body
//     const parseBody = EmailCreateSchema.safeParse(req.body);
//     if (!parseBody.success) {
//       return res.status(400).json({ errors: parseBody.error.errors });
//     }

//     // create mail option
//     const { sender, recipient, subject, body, source } = parseBody.data;
//     const from = sender || defaultSender;
//     const emailOption = {
//       from,
//       to: recipient,
//       subject,
//       text: body,
//     };

//     // send the mail
//     const { rejected } = await transporter.sendMail(emailOption);
//     if (rejected.length) {
//       console.log("Email rejected: ", rejected);
//       return res.status(500).json({ message: "Failed" });
//     }

//     await prisma.email.create({
//       data: {
//         sender: from,
//         recipient,
//         subject,
//         body,
//         source,
//       },
//     });

//     return res.status(200).json({ message: "Email sent" });
//   } catch (error) {
//     next(error);
//   }
// };

// export default sendEmail;

// Importing the 'zod' library which provides a way to validate data schemas
import { z } from "zod";

// Defining a schema for an email creation object using zod
export const EmailCreateSchema = z.object({
  recipient: z.string().email(), // recipient must be a valid email string
  subject: z.string(), // subject must be a string
  body: z.string(), // body must be a string
  source: z.string(), // source must be a string
  sender: z.string().email().optional(), // sender is an optional field that, if present, must be a valid email string
});

// Defining a TypeScript type based on the EmailCreateSchema
export type EmailCreateDTO = z.infer<typeof EmailCreateSchema>;

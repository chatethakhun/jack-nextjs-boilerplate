import * as z from 'zod';

export const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
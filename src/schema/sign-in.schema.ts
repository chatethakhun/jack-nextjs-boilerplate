import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
});

export type SignInFormData = z.infer<typeof signInSchema>;
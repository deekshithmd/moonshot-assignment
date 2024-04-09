import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string()
        .min(1, 'Password is required')
        .min(4, 'Password must be more than 4 characters')
        .max(16, 'Password must be less than 16 characters')
});

export const loginUserSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string()
        .min(1, 'Password is required')
});

export const userSchema = z.object({
    id: z.number(),
    email: z.string(),

})

export const otpSchema = z.object({
    token: z.string(),
    otp: z.number()
})

export const interestUpdateSchema = z.object({
    categoryId: z.number(),
    token: z.string()
})

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;
export type LoginUserInput = z.TypeOf<typeof loginUserSchema>;
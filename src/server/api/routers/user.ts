import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createUserSchema, interestUpdateSchema, loginUserSchema, otpSchema } from '@/schema/user.schema';
import { randomInt } from 'crypto';
import { TRPCError } from '@trpc/server';
import { sendVerificationEmail } from '@/utils/mailer';
import jwt from 'jsonwebtoken'
import { z } from 'zod';
import { type Secret } from 'jsonwebtoken';

export type UserType = {
    name: string;
    email: string;
    id: number;
    verified?: boolean;
}

export const userRouter = createTRPCRouter({
    create: publicProcedure
        .input(createUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.users.create({
                data: createUserSchema.parse(input),
            });
            if (user?.email) {
                const token = jwt.sign({ name: user?.name, email: user?.email, id: user?.id }, process.env.JWT_SECRET as Secret);
                const otp = randomInt(10000000, 99999999);
                await ctx.db.users.update({
                    where: { id: user?.id },
                    data: { otp }
                })
                await sendVerificationEmail({ email: user?.email, otp });
                return { token };
            }
            else {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User no created' })
            }

        }),
    loginUser: publicProcedure
        .input(loginUserSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.users.findUnique({
                where: { email: input.email }
            })

            if (user?.email) {
                const userData = { name: user?.name, email: user?.email, id: user?.id, verified: user?.verified }
                if (user?.password === input.password) {
                    if (user?.verified) {
                        const token: string = jwt.sign(userData, process.env.JWT_SECRET as Secret);
                        return { ...userData, token };
                    }
                    else {
                        const token: string = jwt.sign(userData, process.env.JWT_SECRET as Secret);
                        const otp = randomInt(10000000, 99999999);
                        await ctx.db.users.update({
                            where: { id: user?.id },
                            data: { otp }
                        })
                        await sendVerificationEmail({ email: user?.email, otp })
                        return { ...userData, token };
                    }
                }
                else {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Password is not matched, please provide valid password' })
                }
            }
            else {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No account associated with the email, please signup' })
            }
        }),
    verifyUser: publicProcedure
        .input(otpSchema)
        .mutation(async ({ ctx, input }) => {
            let userId = 0;
            jwt.verify(input.token, String(process.env.JWT_SECRET), (err, user) => {
                if (err) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' })
                }
                else {
                    if (user && typeof user !== 'string') {
                        userId = Number(user?.id);
                    }
                }
            })
            const user = await ctx.db.users.findUnique({
                where: { id: userId }
            })

            if (user?.email) {
                const userData = { name: user?.name, email: user?.email, id: user?.id }
                if (user?.otp === input?.otp) {
                    await ctx.db.users.update({
                        where: { id: user?.id },
                        data: { verified: true, otp: 0 }
                    })
                    const token: string = jwt.sign(userData, process.env.JWT_SECRET as Secret);
                    return {
                        ...userData, token
                    };
                }
                else {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'OTP is not valid' })
                }
            }
        }),
    updateInterests: publicProcedure
        .input(interestUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            let userId = 0;
            jwt.verify(input.token, process.env.JWT_SECRET as Secret, (err, user) => {
                if (err) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' })
                }
                else {
                    if (user && typeof user !== 'string') {
                        userId = Number(user?.id);
                    }

                }
            })
            const user = await ctx.db.users.findUnique({
                where: { id: userId }
            })
            let updatedInterestList = user?.interests?.map(item => item);
            if (user?.interests?.includes(input?.categoryId)) {
                updatedInterestList = user?.interests?.filter(id => id !== input?.categoryId)
            }
            else {
                if (updatedInterestList && updatedInterestList?.length >= 0) {
                    updatedInterestList.push(input?.categoryId)
                }
            }
            await ctx.db.users.update({
                where: { id: user?.id },
                data: { interests: updatedInterestList }
            })
        }),
    getUser: publicProcedure
        .input(z.object({ token: z.string() }))
        .query(({ ctx, input }) => {
            let userId = 0;
            jwt.verify(input.token, process.env.JWT_SECRET as Secret, (err, user) => {
                if (err) {
                    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not authorized' })
                }
                else {
                    if (user && typeof user !== 'string') {
                        userId = Number(user?.id);
                    }
                }
            })
            return ctx.db.users.findUnique({
                where: { id: userId },
                // data: {
                //     name,
                //     email,
                //     id,
                //     interests
                // }
            });
        }),
})
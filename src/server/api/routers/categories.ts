import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from 'zod';

export const categoriesRouter = createTRPCRouter({
    getCategories: publicProcedure.input(z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
    })).query(async ({ ctx, input }) => {
        const { cursor } = input
        const limit = input?.limit ?? 6;
        const categories = await ctx.db.categories.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (categories?.length > limit) {

            const nextItem = categories.pop();
            nextCursor = nextItem?.id;
        }

        return {
            categories,
            nextCursor
        }
    }),
})
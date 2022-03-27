import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
    const applicable_actions = [ "findFirst", "findMany" ] 
    const set_deletedAt_rule = applicable_actions.indexOf(params.action) !== -1
    if (set_deletedAt_rule) {
        if (params.args.where) {
            if (params.args.where.deletedAt === undefined) params.args.where.deletedAt = { equals: null };
        } else params.args.where = { deletedAt: { equals: null } }
    }
    if (params.action === "findUnique") {
        const value = await next(params);
        if (!value.deletedAt) return value
        return value;
    }
    return next(params);
})

export default prisma;
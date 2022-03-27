import { Prisma, Category } from "@prisma/client";
import prisma from "../../prisma";
import { ErrorHandler } from "../../utils/error";
import { ExpandField, ExpandFieldOptional, GeneralOptions, PaginationOptions, ResponseMetadata } from "./types";

const parsePaginationOptions = (pagination: PaginationOptions) => {
    const parsed: Prisma.CategoryFindManyArgs = { take: 3 }
    const { cursor, limit } = pagination;
    if (limit) parsed.take = limit;
    if (cursor) {
        const decoded_id: string = atob(cursor);
        parsed.where = { id: { gte: Number(decoded_id) } }
    }
    return parsed;
}

const parseGeneralOptions = (options: GeneralOptions) => {
    const keys: Array<keyof GeneralOptions> = Object.keys(options) as Array<keyof GeneralOptions>;
    const parsed: any = {};
    for (let x: number = 0; x < keys.length; x++){
        const key = keys[x];
        switch (key) {
            case "expand":
                if (typeof(options[key]) === "undefined") break;
                const value: ExpandFieldOptional = options[key];
                const include: Record<string, boolean> = {}
                value?.forEach(val => include[val] = true)
                parsed.include = include;
        }
    }
    return parsed
}

export const findByPkOr404 = async (pk: number, options: GeneralOptions): Promise<Array<Category | ResponseMetadata>> => {
    const where: Prisma.CategoryWhereUniqueInput = { id: pk };
    const extra = parseGeneralOptions(options);
    const category = await prisma.category.findUnique({ where, ...extra });
    if (!category) throw ErrorHandler.get404("Category");
    return [ category, { } ]
}

export const findAll = async (pagination: PaginationOptions): Promise<Array<Array<Category> | ResponseMetadata>> => {
    const args = parsePaginationOptions(pagination);
    console.log(args, pagination)
    const categories: Array<Category> = await prisma.category.findMany({ ...args })
    const response_metadata: ResponseMetadata = { next_cursor: "" }

    if (categories.length) {
        const lastCategory: Category = categories[categories.length - 1];
    
        const next_category: Category | null = await prisma.category.findFirst({
            where: {
                id: { "gt": lastCategory.id }
            }
        })
        const next_cursor: string = next_category ? btoa(String(next_category.id)) : ""
        response_metadata.next_cursor = next_cursor;
    }
    return [ categories, response_metadata ]
}

export const createCategory = async (data: Prisma.CategoryCreateWithoutPostsInput): Promise<Array<Category | ResponseMetadata>> => {
    const category: Category = await prisma.category.create({ data });
    return [ category, { } ]
}

// export default {
//     indfByPkOr404: pk => prisma.categories.findByPkOr404(pk),
//     findAll: async ({ page = 1, pageSize = 10 }) => {
//         const where = {}
//         // if (query) where[Sequelize.Op.or] = [
//         //     { contract_type: { [Sequelize.Op.like]: `%${query}%` } },
//         //     { comment: { [Sequelize.Op.like]: `%${query}%` } }
//         // ]
//         return await prisma.categories.findAll({
//             where,
//             offset: (page - 1) & page,
//             limit: pageSize,
//         })
//     },
//     createReferral: async ({ 
//         type, BlogId, UserId
//      }) => await prisma.categories.create({ 
//         data: { type, BlogId, UserId }
//       }),
//     updateReferral: async ({pk,data}) => {
//         let keys = Object.keys(data);
//         let referral = await prisma.categories.findByPkOr404(pk);
//         for (let key of keys){
//             referral[key] = data[key]
//         }
//         await categories.save();
//         return referral;
//     },
//     deleteReferral: async (pk) => await (await (await prisma.categories.findByPkOr404(pk))).destroy()
// }
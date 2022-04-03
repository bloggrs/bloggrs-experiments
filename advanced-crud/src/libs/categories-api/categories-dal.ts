import { Prisma, Category } from "@prisma/client";
import prisma from "../../prisma";
import { ErrorHandler } from "../../utils/error";
import { ExpandFieldOptional, GeneralOptions, PaginationOptions, ResponseMetadata, UpdateCategoryArgs } from "./types";

export const parsePaginationOptions = (pagination: PaginationOptions) => {
    const parsed: Prisma.CategoryFindManyArgs = { take: 3 }
    const { cursor, limit } = pagination;
    if (limit) parsed.take = limit;
    if (cursor) {
        const decoded_id: string = atob(cursor);
        parsed.where = { id: { gte: Number(decoded_id) } }
    }
    return parsed;
}

export const parseGeneralOptions = (options: GeneralOptions) => {
    const keys: Array<keyof GeneralOptions> = Object.keys(options) as Array<keyof GeneralOptions>;
    const parsed: any = {};
    for (let x: number = 0; x < keys.length; x++){
        const key = keys[x];
        switch (key) {
            case "expand":
                if (typeof(options[key]) === "undefined") break;
                const value: ExpandFieldOptional = options[key];
                const include: Prisma.CategoryInclude = {}
                value?.forEach((expand_key: keyof Prisma.CategoryInclude) => {
                    include[expand_key] = true;
                })
                parsed.include = include;
                break;
        }
    }
    return parsed
}

export const findByPkOr404 = async (
    pk: number, 
    options: GeneralOptions,
    fn: Function = prisma.category.findUnique
): Promise<Category> => {
    const where: Prisma.CategoryWhereUniqueInput = { id: pk };
    const extra = parseGeneralOptions(options);
    const category = await fn({ where, ...extra });
    if (!category) throw ErrorHandler.get404("Category");
    return category
}

export const findAll = async (options: PaginationOptions & GeneralOptions): Promise<Array<Array<Category> | ResponseMetadata>> => {
    const args = parsePaginationOptions(options);
    const extra = parseGeneralOptions(options);
    const categories: Array<Category> = await prisma.category.findMany({ ...args, ...extra })
    const response_metadata: ResponseMetadata = { next_cursor: "" }

    if (categories.length) {
        const lastCategory: Category = categories[categories.length - 1];
        const next_category: Category | null = await prisma.category.findFirst({
            where: {
                id: { gt: lastCategory.id }
            }
        })
        const next_cursor: string = next_category ? btoa(String(next_category.id)) : ""
        response_metadata.next_cursor = next_cursor;
    }
    return [ categories, response_metadata ]
}

export const createCategory = async (data: Prisma.CategoryCreateWithoutPostsInput, options: GeneralOptions): Promise<Category> => {
    const extra = parseGeneralOptions(options);
    const category: Category = await prisma.category.create({ data, ...extra });
    return category
}

export const updateCategory = async (pk: number, data: UpdateCategoryArgs, options: GeneralOptions): Promise<Category> => {
    const extra = parseGeneralOptions(options);
    const category: Category = await prisma.category.update({
        where: { id: pk }, data, ...extra
    })
    return category
}

export const deleteCategory = async (pk: number): Promise<Category> => {
    const category: Category = await prisma.category.update({
        where: { id: pk },
        data: { deletedAt: new Date() }
    })
    return category
}
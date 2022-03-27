import { Prisma } from "@prisma/client";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
const categoryWithoutDateFields = Prisma.validator<Prisma.CategoryArgs>()({
    select: { title: true, slug: true }, 
})
export type UpdateCategoryArgs = Prisma.CategoryGetPayload<typeof categoryWithoutDateFields>

export type ExpandField = Array<keyof Prisma.CategoryInclude>
export type ExpandFieldOptional = ExpandField | undefined

export type PaginationOptions = {
    cursor?: string;
    limit?: number;
}

export type GeneralOptions = {
    expand?: ExpandField
}

export type ResponseMetadata = {
    next_cursor?: string;
}
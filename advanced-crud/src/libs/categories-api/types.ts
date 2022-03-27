import { Prisma } from "@prisma/client";

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
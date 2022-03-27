import { Prisma } from "@prisma/client";


export type ExpandField = Array<keyof Prisma.CategoryInclude>
export type ExpandFieldOptional = ExpandField | undefined

export type GeneralOptions = {
    cursor?: string;
    limit?: number;
    expand?: ExpandField
}
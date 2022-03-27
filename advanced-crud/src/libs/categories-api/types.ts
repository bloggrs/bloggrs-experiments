import { Category, Prisma } from "@prisma/client";
// import { ApiResponse, ResponseMetadata } from "../../utils/types";

export type CategoryExpand<T, K extends keyof Prisma.CategoryInclude> = {
    [P in K]: T;
}

export type GeneralOptions = {
    expand?: CategoryExpand<boolean, keyof Prisma.CategoryInclude>;
}

export type CategoriesBaseOptions = GeneralOptions & {
    cursor?: string;
    limit?: number;
}


// export type GetCategoryResponse = 
//     ApiResponse & {
//         data: Category
//     }

// export type GetCategoriesResponse = 
//     ApiResponse & {
//         data: Category
//     } &
//     {
//         response_metadata: ResponseMetadata
//     }
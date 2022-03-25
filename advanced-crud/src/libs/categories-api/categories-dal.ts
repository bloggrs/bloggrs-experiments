import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import { ErrorHandler } from "../../utils/error";

export const findByPkOr404 = async (pk: number) => {
    const where: Prisma.CategoryWhereUniqueInput = { id: pk };
    const category = await prisma.category.findUnique({ where });
    if (category) throw ErrorHandler.get404("Category");
    return category;
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
import { assert, expect } from "chai";
import { prismaMock } from "../../../prismaMock";
import { ErrorHandler } from "../../../utils/error";

import { 
    parsePaginationOptions,
    parseGeneralOptions,
    findByPkOr404,
    findAll,
    createCategory,
    updateCategory,
    deleteCategory
} from "../categories-dal"

describe("parsePaginationOptions function", () => {
    it("returns pagination options", (done: jest.DoneCallback) => {
        const io: any = [
            {
                input: [
                    {
                        limit: 2
                    }
                ],
                output: {
                    take: 2
                }
            },
            {
                input: [
                    {
                        limit: 4
                    }
                ],
                output: {
                    take: 4
                }
            },
            {
                input: [
                    {
                        cursor: btoa("3")
                    }
                ],
                output: {
                    where: { id: { gte: Number(atob(btoa("3"))) } },
                    take: 3
                }
            },
            {
                input: [
                    {
                        cursor: btoa("14"),
                        limit: 4
                    }
                ],
                output: {
                    where: { id: { gte: Number(atob(btoa("14"))) } },
                    take: 4
                }
            },
        ]
        for (let item of io) {
            const input: [ any ] = item.input
            const output = parsePaginationOptions(...input);
            assert.deepStrictEqual(output, item.output);
        }
        done();
    })
})

describe("parseGeneralOptions function", () => {
    it("returns general options", (done: jest.DoneCallback) => {
        const io: any = [
            {
                input: [
                    {}
                ],
                output: {}
            },
            {
                input: [
                    { 
                        expand: []
                    }
                ],
                output: {
                    include: {}
                }
            },
            {
                input: [
                    {
                        expand: [ "posts" ]
                    }
                ],
                output: {
                    include: {
                        posts: true
                    }
                }
            },
            {
                input: [
                    {
                        expand: [ "posts", "_count" ]
                    }
                ],
                output: {
                    include: {
                        posts: true,
                        _count: true
                    }
                }
            },
        ]
        for (let item of io) {
            const input: [ any ] = item.input;
            const output = parseGeneralOptions(...input);
            assert.deepStrictEqual(output, item.output);
        }
        done();
    })
})

describe("findByPkOr404 function", () => {
    it("returns category object", async () => {
        const categories = [
            {
                id: 1,
                title: "Category Name",
                slug: "category-name",
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                title: "Category Name",
                slug: "category-name",
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]
        const io: any = [
            {
                input: [
                    1,
                    { },
                    async () => categories.find(c => c.id == 1)
                ],
                output: categories[0]
            },
            {
                input: [
                    4,
                    { },
                    async () => categories.find(c => c.id == 4)
                ],
                output: ErrorHandler.get404("Category").message
            },
        ]
        for (let item of io) {
            const input: [ number, object, Function ] = item.input;
            const output: any = await findByPkOr404(...input).catch(err => err.message);
            assert.deepStrictEqual(output, item.output);
        }
    })
})
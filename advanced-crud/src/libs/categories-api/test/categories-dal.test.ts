import { assert, expect } from "chai";
import { prismaMock } from "../../../prismaMock";

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
        const io = [
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
            const output = parsePaginationOptions(...item.input);
            assert.deepStrictEqual(output, item.output);
        }
        done();
    })
})

describe("parseGeneralOptions function", () => {
    it("returns general options", (done: jest.DoneCallback) => {
        const io = [
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
            const output = parseGeneralOptions(...item.input);
            assert.deepStrictEqual(output, item.output);
        }
        done();
    })
})

describe("findByPkOr404 function", () => {
    it("returns category object", (done: jest.DoneCallback) => {
        const io = [
            {
                input: [
                    1,
                    { },
                    prismaMock.category.findUnique.mockResolvedValue
                ],
                output: prismaMock.category.findUnique.mockResolvedValue()
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
            const output = parseGeneralOptions(...item.input);
            assert.deepStrictEqual(output, item.output);
        }
        done();
    })
})

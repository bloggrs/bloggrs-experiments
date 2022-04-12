const { deepStrictEqual } = require("assert")
const { deletePost } = require("..")

const mock_findUserById = (UserId) => db.users.find(u => u.id === UserId)
const mock_findPostById = (PostId) => db.posts.find(p => p.id === PostId)
const mock_deletePostById = () => {};

const db = {
    users: [
        {
            id: 1,
            username: "TheEggCooker"
        },
        {
            id: 2,
            username: "TheEggDeleter"
        }
    ],
    posts: [
        {
            id: 1,
            title: "How to cook eggs",
            description: "...",
            createdBy: 1
        }
    ]
}

const functions = {
    findUserById: mock_findUserById,
    findPostById: mock_findPostById,
    deletePostById: mock_deletePostById
}

describe("deletePost function tests", () => {
    it("user doesn't exist", async () => {
        const vars = {
            UserId: 5,
            PostId: 1,
            functions
        }
        const result = await deletePost(vars);
        const expected = [ false, "User not found" ]
        deepStrictEqual(result, expected);
    });
    it("post doesn't exist", async () => {
        const vars = {
            UserId: 1,
            PostId: 5,
            functions
        }
        const result = await deletePost(vars);
        const expected = [ false, "Post not found" ]
        deepStrictEqual(result, expected);
    });
    it("user/post exists, but user didn't create post", async () => {
        const vars = {
            UserId: 2,
            PostId: 1,
            functions
        }
        const result = await deletePost(vars);
        const expected = [ false, "Not authorized" ]
        deepStrictEqual(result, expected);
    });
    it("user has access, deleted post successfully", async () => {
        const vars = {
            UserId: 1,
            PostId: 1,
            functions
        }
        const result = await deletePost(vars);
        const expected = [ true ]
        deepStrictEqual(result, expected);
    });
})
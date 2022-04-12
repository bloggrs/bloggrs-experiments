
const deletePost = async ({ 
    UserId, 
    PostId, 
    functions = {
        findUserById,
        findPostById,
        deletePostById
    } 
}) => {
    const user = await functions.findUserById(UserId);
    if (!user) return [ false, "User not found" ]
    const post = await functions.findPostById(PostId);
    if (!post) return [ false, "Post not found" ]
    const user_created_post = post.createdBy === user.id;
    if (!user_created_post) return [ false, "Not authorized" ];
    await functions.deletePostById(PostId);
    return [ true ];
} 
module.exports = {
    deletePost
}
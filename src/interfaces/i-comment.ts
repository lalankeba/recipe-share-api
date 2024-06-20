interface CommentUser {
    userId: string;
    userFullName: string;
}

interface IComment {
    description: string;
    user: CommentUser;
    recipeId: string;
}

interface DisplayableComment extends IComment {
    id: string;
    __v: number;
}

export default IComment;
export { DisplayableComment, CommentUser };

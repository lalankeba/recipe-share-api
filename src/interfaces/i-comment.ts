
interface IComment {
    description: string;
    userId:string;
    recipeId: string;
}

interface DisplayableComment extends IComment {
    id: string;
    __v: number;
}

export default IComment;
export { DisplayableComment };

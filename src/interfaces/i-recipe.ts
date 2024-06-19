
interface RecipeTimes {
    prepTime: string;
	cookTime: string;
	additionalTime: string;
}

interface RecipeCategory {
    categoryId: string; 
    description: string;
}

interface RecipeComment {
    commentId: string; 
    description: string;
    createdAt: string;
    userId: string;
    userFullName: string;
}

interface RecipeUser {
    userId: string;
    userFullName: string;
}

interface IRecipe {
    title: string;
    subTitle: string;
    picture: string;
    instructions: string;
    ingredients: string[];
    times: RecipeTimes;
    categories: RecipeCategory[];
    tags: string[];
    comments: RecipeComment[];
    totalComments: number;
    user: RecipeUser;
}

interface DisplayableRecipe extends IRecipe {
    id: string;
    __v: number;
}

export default IRecipe;
export { DisplayableRecipe, RecipeUser };

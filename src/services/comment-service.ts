import logger from "../config/logger";
import { DisplayableComment } from "../interfaces/i-comment";
import commentModel, { CommentDocument } from "../models/comment-model";
import { validateCommentDescription } from "../validators/comment-validator";

const createComment = async (userId: string, recipeId: string, description: string): Promise<DisplayableComment> => {
    validateCommentDescription(description);
    
    const commentDocument: CommentDocument = await commentModel.create({
        description: description.trim(),
        userId,
        recipeId
    });

    logger.info(`Comment created`);
    
    return commentDocument.toJSON();
}

export { createComment };
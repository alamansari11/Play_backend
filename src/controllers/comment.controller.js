import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;
    const owner = req.user._id;
    if (!content) {
        throw new ApiError(400, "comment required");
    }
    console.log({ content });

    try {
        const commentVideo = await Comment.create({
            content,
            video: new mongoose.Types.ObjectId(videoId),
            owner: new mongoose.Types.ObjectId(owner),
        });

        if (!commentVideo) {
            throw new ApiError(400, "Can not comment on the video");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(201, commentVideo, "Comment is added to video")
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal server error while posting tweet"
        );
    }
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "commentId required");
    }
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "comment required");
    }
    console.log({ content }, { commentId });

    try {
        const updateCommentVideo = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content: content,
                },
            },
            { new: true }
        );

        if (!updateCommentVideo) {
            throw new ApiError(400, "Can not update comment on the video");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    updateCommentVideo,
                    "Comment is updated on video"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal server error while posting tweet"
        );
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "commentId required");
    }
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "comment required");
    }
    console.log({ content }, { commentId });

    try {
        const updateCommentVideo = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content: content,
                },
            },
            { new: true }
        );

        if (!updateCommentVideo) {
            throw new ApiError(400, "Can not update comment on the video");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    updateCommentVideo,
                    "Comment is updated on video"
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal server error while posting tweet"
        );
    }
});

export { getVideoComments, addComment, updateComment, deleteComment };

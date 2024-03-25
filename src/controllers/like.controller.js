import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    const userId = req.user._id;
    if (!videoId) {
        throw new ApiError(400, "videoId required");
    }
    try {
        const likeCriteria = {
            likedBy: userId,
            video: videoId,
        };
        const alreadyLiked = await Like.findOne(likeCriteria);
        if (!alreadyLiked) {
            const newLike = await Like.create(likeCriteria);
            if (!newLike) {
                throw new ApiError(400, "unable to like video");
            }
            return res.status(201).json(new ApiResponse(201, newLike, "Liked"));
        }
        const deleteLike = await Like.deleteOne(likeCriteria);
        if (!deleteLike) {
            throw new ApiError(400, "unable to unlike video");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, deleteLike, "Video like has been deleted")
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    const userId = req.user._id;
    if (!commentId) {
        throw new ApiError(400, "commentId required");
    }
    try {
        const likeCriteria = {
            likedBy: userId,
            comment: commentId,
        };
        const alreadyLiked = await Like.findOne(likeCriteria);
        if (!alreadyLiked) {
            const newLike = await Like.create(likeCriteria);
            if (!newLike) {
                throw new ApiError(400, "unable to like comment");
            }
            return res.status(201).json(new ApiResponse(201, newLike, "Liked"));
        }
        const deleteLike = await Like.deleteOne(likeCriteria);
        if (!deleteLike) {
            throw new ApiError(400, "unable to unlike comment");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    deleteLike,
                    "comment like has been deleted"
                )
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    const userId = req.user._id;
    if (!tweetId) {
        throw new ApiError(400, "tweetId required");
    }
    try {
        const likeCriteria = {
            likedBy: userId,
            tweet: tweetId,
        };
        const alreadyLiked = await Like.findOne(likeCriteria);
        if (!alreadyLiked) {
            const newLike = await Like.create(likeCriteria);
            if (!newLike) {
                throw new ApiError(400, "unable to like tweet");
            }
            return res.status(201).json(new ApiResponse(201, newLike, "Liked"));
        }
        const deleteLike = await Like.deleteOne(likeCriteria);
        if (!deleteLike) {
            throw new ApiError(400, "unable to unlike tweet");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, deleteLike, "tweet like has been deleted")
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "userId is requreied");
    }
    try {
        const likedVideo = await Like.aggregate([
            {
                $match: {
                    likedBy: userId,
                },
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "likedVideo",
                    pipeline: [
                        {
                            $project: {
                                videoFile: 1,
                                thumbnail: 1,
                                title: 1,
                                description: 1,
                                duration: 1,
                                views: 1,
                                isPublished: 1,
                                _id: 0,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    likedVideo: 1,
                },
            },
        ]);
        console.log({ likedVideo });
        return res
            .status(200)
            .json(new ApiResponse(200, likedVideo, "all liked videos"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

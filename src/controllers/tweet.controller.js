import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  //extract content from request
  //validate the content
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Invalid content");
  }
  try {
    const tweet = await Tweet.create({ content, owner: req.user._id });
    if (!tweet) {
      throw new ApiError(400, "Unable to post tweet");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id required");
  }
  console.log("userId", userId);
  try {
    const userTweets = await Tweet.find({ owner: userId });
    console.log(userTweets);
    const payload = {
      count: userTweets.length,
      userTweets,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, payload, "Tweets fetched successfully"));
  } catch (error) {
    console.log(error?.message);
    throw new ApiError(500, "Internal server error while fetching tweets");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
  }
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Invalid content");
  }
  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );
    if (!updatedTweet) {
      throw new ApiError(400, "Unable to update tweet");
    }
    return res
      .status(202)
      .json(new ApiResponse(201, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
  }
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Invalid content");
  }
  try {
    const deletedTweet = await Tweet.findByIdAndDelete({ _id: tweetId });
    if (!deletedTweet) {
      throw new ApiError(400, "Unable to delete tweet");
    }
    return res
      .status(200)
      .json(new ApiResponse(201, deleteTweet, "Tweet deleted successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

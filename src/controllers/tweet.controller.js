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
    const tweet = await Tweet.create({ content,owner: req.user._id });
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
    const {userId} = req.params;

    if(!userId){
        throw new ApiError(400, "User id required")
    }
    console.log("userId", userId)
    try {
        const userTweets =await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            // {
            //     $lookup: {
            //         from: "tweets",
            //         localField: "_id",
            //         foreignField: "owner",
            //         as: "tweets"
            //     }
            // },
            // {
            //     $project: {
            //       fullName: 1,
            //       username: 1,
            //       content: 1
            //     },
            // }
        ])
        console.log(userTweets)
        return res
        .status(200)
        .json(
            new ApiResponse(200,userTweets, "Tweets fetched successfully")
        )
    } catch (error) {
        console.log(error?.message)
        throw new ApiError(
            500,
            "Internal server error while fetching tweets"
        );
    }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

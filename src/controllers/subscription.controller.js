import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  const subscriberId = req.user._id;
  console.log(req.user._id);

  if (!subscriberId) {
    throw new ApiError(400, "Login to subscribe");
  }

  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });
    if (existingSubscription) {
      const unsubscribe = await existingSubscription.deleteOne();
      return res
        .status(200)
        .json(new ApiResponse(200, unsubscribe, "Unsubscribed successfully"));
    } else {
      const subscribe = await Subscription.create({
        subscriber: subscriberId,
        channel: channelId,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, subscribe, "subscribed successfully"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  console.log(subscriberId);
  try {
    const userSubscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "user_details",
          pipeline: [
            {
              $project: {
                username: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          channel: 1,
          user_details: 1,
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userSubscribers,
          "All subscribers fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  console.log(channelId);
  const userId = channelId;
  try {
    const userSubscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel_detail",
          pipeline: [
            {
              $project: {
                username: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          subscriber: 1,
          channel_detail: 1,
        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userSubscribedChannels,
          "All channels fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

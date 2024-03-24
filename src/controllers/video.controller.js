import mongoose, { isValidObjectId, Mongoose, Schema } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  // console.log({ page, limit, query, sortBy, sortType, userId });

  //here we can also use Number() to convert but parseInt will make sure it be an integer of base 10
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  page = Math.max(1, page); // Ensure the page is atleast 1
  limit = Math.min(10, Math.max(1, limit)); //ensure the limit is between 1 and 10

  const pipeline = [];

  //Match the video by owner Id if provided
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "userId is invalid");
    }
    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  if (query) {
    //as match with text is only allowed as first pipeline hence using unshift to push it in the front
    pipeline.unshift({
      $match: {
        //$match Stage: Inside the conditional block, a $match stage is added to the aggregation pipeline. The $match stage filters documents in the collection that match certain criteria.
        $text: {
          //Within the $match stage, MongoDB's text search functionality is used. This is enabled by the $text operator, which allows for full-text search capabilities.
          $search: query, //The $search operator is used within $text. It specifies the search query provided by the client. MongoDB will search for documents that contain the specified search terms.
        },
      },
    });
  }
  const sortCriteria = {};
  // videos can be sorted based on created at and updated at and other types
  if (sortBy && sortType) {
    sortCriteria[sortBy] = sortType === "asc" ? 1 : -1; // create an object if asc is set the sortBy to 1
    pipeline.push({
      $sort: sortCriteria,
    });
  } else {
    sortCriteria["createdAt"] = -1; // default to descending order of created at
    pipeline.push({
      $sort: sortCriteria,
    });
  }
  const options = {
    page,
    limit,
  };
  // Apply pagination using skip and limit
  pipeline.push({
    $skip: (page - 1) * limit,
  });
  pipeline.push({
    $limit: limit,
  });

  let myAggregate = await Video.aggregate(pipeline);
  // const response = await Video.aggregatePaginate(myAggregate, options);
  // if (!response) {
  //   throw new ApiError(400, "unable to fetch the videos");
  // }
  return res
    .status(200)
    .json(new ApiResponse(200, myAggregate, "Video fetch successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to c```````loudinary, create video
  const { title, description } = req.body;
  const videoFilePath = req?.files?.videoFile?.[0]?.path;
  const thumbnailPath = req?.files?.thumbnail?.[0]?.path;
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (!videoFilePath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  try {
    const videoFile = await uploadOnCloudinary(videoFilePath);
    // console.log("videofile:", videoFile);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    // console.log("thumbnail:", thumbnail);

    if (!(videoFile && thumbnail)) {
      throw new ApiError(
        400,
        "Error occurred while uploading videoFile or thumbnail"
      );
    }
    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration: videoFile?.duration.toFixed(2),
      owner: req.user._id,
    });
    if (!video) {
      throw new ApiError(500, "Unable to upload video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { video }, "Video upload successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "video id required");
  }

  try {
    const video = await Video.findOne({
      _id: new mongoose.Types.ObjectId(videoId),
    });
    if (!video) {
      throw new ApiError(400, "Unable to find video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;
  const thumbnailPath = req.file?.path;
  if (!videoId) {
    throw new ApiError(400, "video id required");
  }
  const updateData = {};
  // add data in object
  if (title) {
    updateData["title"] = title;
  }
  if (description) {
    updateData["description"] = description;
  }
  if (thumbnailPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (thumbnail) {
      updateData["thumbnail"] = thumbnail.url;
    } else {
      throw new ApiError(400, "Error on uploading thumbnail");
    }
  }
  // console.log(updateData);

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );
    if (!updatedVideo) {
      throw new ApiError(400, "Unable to update video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(400, "video id required");
  }
  try {
    const deletedVideo = await Video.deleteOne({ _id: videoId });
    if (!deletedVideo) {
      throw new ApiError(400, "Unable to delete video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    const toggledStatus = await Video.findById({ _id: videoId });
    toggledStatus.isPublished = !toggledStatus.isPublished;
    toggledStatus.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, toggledStatus, "Video status updated"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const owner = req.user?._id;
  //TODO: create playlist
  if (!name || name.trim() === "") {
    throw new ApiError(400, "PlayList name must be provided");
  }
  if (!description || description.trim() === "") {
    throw new ApiError(400, "PlayList description must be provided");
  }
  if (!owner) {
    throw new ApiError(400, "cannot find user");
  }
  console.log({ name }, { description });
  const payload = { name, description, owner };

  try {
    const createdPlaylist = await Playlist.create(payload);
    if (!createPlaylist) {
      throw new ApiError(400, "Playlist can not be created");
    }
    return res
      .status(201)
      .json(new ApiResponse(201, createdPlaylist, "Playlist has been created"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  try {
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      throw new ApiError(400, "Unable to find playlist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "playlist found"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!(playlistId || videoId)) {
    throw new ApiError(400, "playlistId and videoId is required");
  }
  try {
    const addedVideoToPlaylist = await Playlist.findByIdAndUpdate(
      { _id: playlistId },
      {
        $push: {
          videos: videoId,
        },
      },
      {
        new: true,
      }
    );
    if (!addVideoToPlaylist) {
      throw new ApiError(400, "unable to add video to playlist");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, addedVideoToPlaylist, "video added successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!(playlistId || videoId)) {
    throw new ApiError(400, "playlistId and videoId is required");
  }
  try {
    const removedVideoFromPlaylist = await Playlist.updateOne(
      { _id: playlistId },
      {
        $pull: {
          videos: videoId,
        },
      },
      {
        new: true,
      }
    );
    if (!removedVideoFromPlaylist) {
      throw new ApiError(400, "unable to remove video from playlist");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedVideoFromPlaylist,
          "video removed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId) {
    throw new ApiError(400, "PlayList id must be provided");
  }
  try {
    const deletedPlaylist = await Playlist.deleteOne({ _id: playlistId });
    if (!deletePlaylist) {
      throw new ApiError(400, "Unable to delete playlist");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deletedPlaylist, "playlist deleted successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!(name || description)) {
    throw new ApiError(
      400,
      "PlayList name or description must be provided to update"
    );
  }
  //TODO: update playlist
  const payload = {};
  if (name) {
    payload["name"] = name;
  }
  if (description) {
    payload["description"] = description;
  }
  try {
    //if you want to get back the playlist data than user findByIdAndUpdate otheriwse use updateOne
    const updatePlaylist = await Playlist.findByIdAndUpdate(
      { _id: playlistId },
      payload,
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatePlaylist, "playlist updated successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Internal server error while posting tweet"
    );
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

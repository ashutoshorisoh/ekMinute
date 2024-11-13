import { asyncHandler } from "../utils/asyncHandler.js"; // Assuming asyncHandler is in utils
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudInary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadPost = asyncHandler(async (req, res) => {
    const { title, description, username } = req.body;

    if (!title || title.trim() === "") {
        throw new ApiError(400, "title is required");
    }

    if (!username || username.trim() === "") {
        throw new ApiError(400, "username is required");
    }

    // Check if the user exists in the database
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const videoFilePath = req.files?.videoFile ? req.files.videoFile[0]?.path : null;

    if (!videoFilePath) {
        throw new ApiError(400, "upload video first");
    }

    try {
        // Upload the video to Cloudinary
        const videoFileUp = await uploadOnCloudinary(videoFilePath, user.username); // Assuming you have functionality to create a folder for the user

        if (!videoFileUp) {
            throw new ApiError(400, "file upload failed");
        }

        // Create a new video entry in the database
        const newVideo = new Video({
            videoFile: videoFileUp.url, // URL from Cloudinary response
            title,
            description,
            time: videoFileUp.duration, // Adjust based on Cloudinary response
            owner: user._id // Store the owner's ID
        });

        await newVideo.save();

        // Log the file URL and owner's name to the console
        console.log(`Video uploaded: ${videoFileUp.url}`);
        console.log(`Uploaded by: ${user.fullname}`);

        res.status(201).json(new ApiResponse(201, "Video uploaded successfully", newVideo));
    } catch (error) {
        console.error("Detailed error:", error);
        throw new ApiError(500, "An error occurred while uploading the video");
    }
});

const getVideos = asyncHandler(async (req, res) => {
    try {
      const videos = await Video.find().populate('owner'); // Adjust fields as needed
      res.status(200).json(new ApiResponse(200, "Videos fetched successfully", { data: videos }));
    } catch (error) {
      console.error("Detailed error:", error);
      res.status(500).json({ message: 'Error retrieving videos' });
    }
  });

  const getComments = asyncHandler(async (req, res) => {
    const { comments, username, videoFile, title, time } = req.body;

    // Basic validation
    if (!comments || comments.trim() === "") {
        throw new ApiError(400, "Comment is required");
    }
    if (!username || username.trim() === "") {
        throw new ApiError(400, "Username is required");
    }
    if (!videoFile || videoFile.trim() === "") {
        throw new ApiError(400, "Video file is required");
    }
    if (!title || title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }
    if (!time && time !== 0) {
        throw new ApiError(400, "Time is required");
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Find user in DB
    const findUser = await User.findOne({ username: normalizedUsername });
    if (!findUser) {
        throw new ApiError(400, "User doesn't exist");
    }

    // Create the comment with all necessary fields
    const createdComments = await Video.create({
        username,
        comments,
        videoFile,
        title,
        time
    });

    console.log(createdComments);
    return res.status(201).json(new ApiResponse(200, createdComments, "Commented successfully"));
});

  

export {uploadPost, getVideos, getComments} 
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const video = location.state?.video;

  // Redirect to home if accessed without state
  if (!video) {
    navigate("/home");
    return null;
  }

  return (
    <div className="flex justify-center mt-5 items-start bg-white">
    <div className="pb-[56.25%]">
      
      <video
        src={video.videoFile}
        controls
        className="w-full max-w-4xl rounded-md shadow-lg"
      />
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <p className="mt-4 text-sm text-gray-600">
        Uploaded by: {video.owner[0]?.username || "Unknown"}
      </p>
    </div>
    </div>
  );
};

export default VideoPlayer;

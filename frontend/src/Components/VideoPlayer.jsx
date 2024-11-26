import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, Forward, BookMarked } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const VideoPlayer = () => {
  const { contextUser } = useUser(); // Access authenticated user
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [comments, setComments] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const video = location.state?.video;

  // Redirect to home if accessed without state
  if (!video) {
    navigate("/home");
    return null;
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/videos");
        const data = await response.json();
        setVideos(data.message.data || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    // Set initial like and comment counts
    setLikes(video.likes?.length || 0);
    setComments(video.comments?.length || 0);

    // Check if the user has already liked the video
    if (video.likes?.includes(contextUser)) {
      setLikedByUser(true);
    }
  }, [video, contextUser]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert("Please log in to like this video.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/${video._id}/likes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: contextUser }),
        }
      );
  
      if (response.ok) {
        const updatedVideo = await response.json();
        setLikes(updatedVideo.message.likes.length);
       
        setLikedByUser(likedByUser); // Update the likes count
      } else {
        alert("Failed to update like.");
        console.error("Failed to update like.");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };
  

  const handleComment = async () => {
    if (!isAuthenticated) {
      alert("Please log in to comment on this video.");
      return;
    }

    const commentText = prompt("Enter your comment:");
    if (!commentText) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/${video._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: contextUser, comment: commentText }),
        }
      );

      if (response.ok) {
        setComments((prev) => prev + 1); // Increment comment count on success
      } else {
        alert("Failed to post the comment.");
        console.error("Failed to post the comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading videos...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-green-950">
      {/* Sticky Video Player Section */}
      <div className="lg:w-[55%] h-full w-full lg:sticky top-0 overflow-hidden shadow-md flex items-start justify-center pt-1 ml-2 mr-2">
        <div className="w-full mx-auto pb-[56.25%] flex flex-col items-center object-contain">
          <video
            src={video.videoFile}
            controls
            className="w-full h-[388px] aspect-video shadow-md"
          />
          <div className="flex flex-col justify-between bg-blue-400 p-6 mt-4 rounded-br-full shadow-md w-full">
            <div className="flex justify-between">
              <h1 className="lg:text-2xl text-xl font-bold">{video.title}</h1>
              <h1 className="lg:text-2xl text-xl font-semibold">
                {video.views} views
              </h1>
            </div>
            <div className="flex justify-center mt-4 gap-20">
              <button
                className={`text-sm shadow-md rounded-md px-6 py-3 flex gap-1 flex-row ${
                  likedByUser ? "text-red-700" : "text-black hover:text-white"
                }`}
                onClick={handleLikeToggle}
              >
                <p>{likes}</p> <Heart fill={likedByUser ? "red" : "none"} />
              </button>
              <button
                className="text-sm shadow-md rounded-md px-6 gap-1 justify-center items-center flex flex-row py-3 text-black hover:text-white"
                onClick={handleComment}
              >
                <p>{comments}</p> <MessageCircle />
              </button>
              <button className="text-sm shadow-md rounded-md px-6 py-3 text-black hover:text-white">
                <Forward />
              </button>
              <button className="text-sm shadow-md rounded-md px-6 py-3 text-black hover:text-white">
                <BookMarked />
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <button className="text-sm border shadow-md rounded-lg p-5 text-black bg-blue-300 hover:bg-green-500 font-bold">
                {video.owner[0]?.username || "Unknown"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Suggested Videos Section */}
      <div className="lg:w-[40%] w-full lg:z-0 flex-grow overflow-y-auto p-6 lg:h-full lg:mt-0 mt-[-338px] bg-green-800 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1 mt-[-22px]">
          {videos
            .filter((vid) => vid._id !== video.id) // Exclude the currently playing video
            .map((suggestedVideo) => (
              <div
                key={suggestedVideo._id}
                className="flex flex-col bg-gray-100 shadow-md rounded-sm overflow-hidden cursor-pointer hover:shadow-lg"
                onClick={() =>
                  navigate(`/video/${suggestedVideo._id}`, {
                    state: { video: suggestedVideo },
                  })
                }
              >
                <video
                  src={suggestedVideo.videoFile}
                  className="w-full aspect-video object-cover"
                  controls={false}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">
                    {suggestedVideo.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {suggestedVideo.views} views
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

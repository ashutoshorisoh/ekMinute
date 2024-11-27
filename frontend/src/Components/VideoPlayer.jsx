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

    // Initialize like and comment counts
    setLikes(video.likes?.length || 0);
    setComments(video.comments?.length || 0);

    // Check if user has liked the video
    setLikedByUser(video.likes?.some(like => like.username === contextUser));
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
          method: "POST", // Backend toggles like/unlike
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: contextUser }),
        }
      );

      if (response.ok) {
        const updatedVideo = await response.json();

        // Update likes count and likedByUser state
        setLikes(updatedVideo.message.likes.length);
        setLikedByUser(updatedVideo.message.likes.some(like => like.username === contextUser));
      } else {
        alert("Failed to update like.");
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
        setComments((prev) => prev + 1); // Increment comment count
      } else {
        alert("Failed to post the comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading videos...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white">
      {/* Sticky Video Player Section */}
      <div className="lg:w-[60%] h-screen w-full lg:sticky top-0 overflow-hidden shadow-md flex items-start justify-center pt-1 mb-[-140px] ml-2 mt-1 mr-2">
        <div className="w-full mx-auto pb-[56.25%] flex flex-col items-center object-contain">
          <video
            src={video.videoFile}
            controls
            className="w-full h-[388px] aspect-video shadow-md"
          />
          <div className="flex flex-col justify-between bg-black text-white p-6 mt-4 rounded-b-md shadow-md border-black border shadow-slate-600 w-full">
            <div className="flex justify-between">
              <h1 className="lg:text-2xl text-xl font-bold">{video.title}</h1>
              <h1 className="lg:text-2xl text-xl font-semibold">
                {video.views} views
              </h1>
            </div>

            <div className="flex justify-center mt-4 gap-20 text-white">
  {/* Like Button */}
  <button
    className={`text-sm shadow-md rounded-md px-6 py-3 flex gap-1 text-white hover:bg-gray-700 hover:text-red-200`} // Added hover effect for background and text color
    onClick={handleLikeToggle}
  >
    <p>{likes}</p>
    <Heart
      className={`w-5 h-5 ${likedByUser ? "fill-red-800 text-red-700" : "text-white"}`}
    />
  </button>

  {/* Comment Button */}
  <button
    className="text-sm shadow-md rounded-md px-6 gap-1 justify-center items-center flex flex-row py-3 text-white hover:bg-gray-700 hover:text-red-200" // Added hover effect for background and text color
    onClick={handleComment}
  >
    <p>{comments}</p>
    <MessageCircle className="hover:text-red-200" /> {/* Added hover effect to the icon */}
  </button>

  <button className="text-sm shadow-md rounded-md px-6 py-3 text-white hover:bg-gray-700 hover:text-red-200">
    <Forward className="hover:text-red-200" /> {/* Added hover effect to the icon */}
  </button>

  <button className="text-sm shadow-md rounded-md px-6 py-3 text-white hover:bg-gray-700 hover:text-white">
    <BookMarked className="hover:text-white" /> {/* Added hover effect to the icon */}
  </button>
            </div>


            <div className="flex justify-between mt-1">
              <button className="text-sm border shadow-md rounded-lg p-5 text-black bg-blue-300 hover:bg-green-500 font-bold">
                {video.owner[0]?.username || "Unknown"}
              </button>
            </div>
            {/*comments*/}
            
          </div>
          <div className=" border border-black w-full p-6">
            {video.comments.map((comment, index) => (
                <p key={comment._id}>
                    <strong>{comment.username}:</strong> {comment.comment}
                </p>
            ))}
            </div>
        </div>
        
      </div>
      

      {/* Suggested Videos Section */}
      <div className="lg:w-[30%] w-full flex-grow overflow-y-auto pl-1 pr-1 pb-1 bg-white border-l-2 border-r-2 text-black pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-1">
          {videos
            .filter((vid) => vid._id !== video.id)
            .map((suggestedVideo) => (
              <div
                key={suggestedVideo._id}
                className="flex flex-col bg-white border-black border shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg  text-black"
                onClick={() =>
                  navigate(`/video/${suggestedVideo._id}`, {
                    state: { video: suggestedVideo },
                  })
                }
              >
                <video
                  src={suggestedVideo.videoFile}
                  className="w-full aspect-video object-contain"
                  controls={false}
                />
                <div className="flex flex-row items-center justify-between pl-5 pr-5">
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">
                    {suggestedVideo.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                    <p>{suggestedVideo.owner[0]?.username}</p>
                    
                    </p>
                  </div>
                  <div>
                    <p>{suggestedVideo.views} views</p>
                  </div>

                </div>
                
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

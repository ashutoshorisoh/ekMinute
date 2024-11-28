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
  const [commentBox, setCommentBox] = useState(false);
  const [newComment, setNewComment] = useState(""); // State for the new comment input
  const [commentList, setCommentList] = useState([]); // State to manage comment list

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
    setCommentList(video.comments || []); // Set initial comment list

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

  const handleCommentBox = () => {
    setCommentBox(prevState => !prevState); // Toggles the state between true and false
  };

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please log in to comment on this video.");
      return;
    }

    if (!newComment) return; // Don't post empty comments

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/${video._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: contextUser, comment: newComment }),
        }
      );

      if (response.ok) {
        const updatedVideo = await response.json();
        // Update the comment list with the new comment
        setCommentList(updatedVideo.message.comments);
        setComments(updatedVideo.message.comments.length); // Update the comment count
        setNewComment(""); // Reset the input field
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
    <div className="flex flex-col lg:flex-row gap-4">
  {/* Main Video Section */}
  <div className="lg:w-2/3">
    {/* Video Player */}
    <div className="sticky top-0 bg-black">
      <video src={video.videoFile} controls className="w-full h-auto" />
    </div>

    {/* Video Details */}
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">{video.title}</h1>
        <p className="text-gray-500">{video.views} views</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 text-gray-700"
          onClick={handleLikeToggle}
        >
          <Heart className="text-red-500" />
          <p>{likes}</p>
        </button>

        <button
          className="flex items-center gap-2 text-gray-700"
          onClick={handleCommentBox}
        >
          <MessageCircle />
          <p>{comments}</p>
        </button>

        <button className="flex items-center gap-2 text-gray-700">
          <Forward />
        </button>

        <button className="flex items-center gap-2 text-gray-700">
          <BookMarked />
        </button>
      </div>

      {/* Video Owner */}
      <div className="mb-4">
        <button className="px-4 py-2 bg-gray-200 rounded-md">
          {video.owner[0]?.username || "Unknown"}
        </button>
      </div>

      {/* Comments Section */}
      <div id="comments-section" className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Post
          </button>
        </div>
        <div className="space-y-4">
          {commentList.map((comment) => (
            <p key={comment._id}>
              <span className="font-semibold">{comment.username}:</span>{" "}
              {comment.comment}
            </p>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Suggested Videos Section */}
  <div className="lg:w-1/3 p-4">
    <h2 className="text-lg font-semibold mb-4">Suggested Videos</h2>
    <div className="space-y-4">
      {videos
        .filter((vid) => vid._id !== video._id)
        .map((suggestedVideo) => (
          <div
            key={suggestedVideo._id}
            onClick={() =>
              navigate(`/video/${suggestedVideo._id}`, {
                state: { video: suggestedVideo },
              })
            }
            className="flex items-start gap-4 cursor-pointer"
          >
            <video
              src={suggestedVideo.videoFile}
              className="w-24 h-16 object-cover rounded"
            />
            <div>
              <h1 className="text-sm font-semibold">{suggestedVideo.title}</h1>
              <p className="text-gray-500 text-xs">{suggestedVideo.views} views</p>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>

  


  
  

  


  
  );
};

export default VideoPlayer;

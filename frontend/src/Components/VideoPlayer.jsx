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
    <div className="flex flex-col lg:flex-row w-full bg-white overflow-x-hidden h-screen">
  {/* Sticky Video Player Section */}
  <div className="w-full lg:w-[60%] h-[calc(1620vh-100px)] lg:h-full overflow-y-auto shadow-md flex flex-col items-center justify-start pt-1 mb-2 ml-2 mt-1 mr-2">
    <div className="w-full mx-auto flex flex-col items-center mb-4">
      <video
        src={video.videoFile}
        controls
        className="w-full aspect-video shadow-md"
      />
      
      {/* Bottom Section with Video Details */}
      <div className="flex flex-col justify-between bg-black text-white p-6 mt-4 rounded-b-md shadow-md border-black border shadow-slate-600 w-full">
        <div className="flex justify-between">
          <h1 className="lg:text-2xl text-xl font-bold">{video.title}</h1>
          <h1 className="lg:text-2xl text-xl font-semibold">{video.views} views</h1>
        </div>

        {/* Like, Comment, Forward, and Bookmark Buttons */}
        <div className="flex justify-center mt-4 gap-12 text-white">
          <button
            className="text-sm shadow-md rounded-md px-6 py-3 flex gap-1 text-white hover:bg-gray-700 hover:text-red-200"
            onClick={handleLikeToggle}
          >
            <p>{likes}</p>
            <Heart
              className={`w-5 h-5 ${likedByUser ? "fill-red-800 text-red-700" : "text-white"}`}
            />
          </button>

          <button
            className="text-sm shadow-md rounded-md px-6 py-3 flex gap-1 justify-center items-center text-white hover:bg-gray-700 hover:text-red-200"
            onClick={handleCommentBox}
          >
            <p>{comments}</p>
            <MessageCircle className="hover:text-red-200" />
          </button>

          <button className="text-sm shadow-md rounded-md px-6 py-3 text-white hover:bg-gray-700 hover:text-white">
            <Forward className="hover:text-red-200" />
          </button>

          <button className="text-sm shadow-md rounded-md px-6 py-3 text-white hover:bg-gray-700 hover:text-white">
            <BookMarked className="hover:text-white" />
          </button>
        </div>

        {/* Video Owner Button */}
        <div className="flex justify-between mt-1">
          <button className="text-sm border shadow-md rounded-lg p-5 text-black bg-blue-300 hover:bg-green-500 font-bold">
            {video.owner[0]?.username || "Unknown"}
          </button>
        </div>

        {/* Comments Section */}
        <div className="border border-black w-full mt-2 rounded-lg pt-4 pl-4 pr-4 pb-4">
          {/* Conditional Comments Display */}
          {commentBox && (
            <div className="mt-4">
              <button className="w-full flex justify-start items-start font-bold">
                Comments
              </button>
              <div className="mb-2 mt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded text-white"
                  placeholder="Write a comment..."
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={handleCommentSubmit}
                >
                  Post Comment
                </button>
              </div>

              {/* Scrollable comments section */}
              <div className="mb-4 max-h-[400px] overflow-y-auto">
                {commentList.map((comment) => (
                  <h1 key={comment._id}>
                    <span className="font-semibold">{comment.username}:</span> {comment.comment}
                  </h1>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Suggested Videos Section */}
  <div className="w-full lg:w-[30%] mt-2 flex-grow overflow-y-auto pl-1 pr-1 pb-1 bg-white border-l-2 border-r-2 text-black pt-1">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
      {videos
        .filter((vid) => vid._id !== video._id)
        .map((suggestedVideo) => (
          <div
            key={suggestedVideo._id}
            className="flex flex-col bg-white border-black border shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg text-black"
            onClick={() =>
              navigate(`/video/${suggestedVideo._id}`, {
                state: { video: suggestedVideo },
              })
            }
          >
            <video
              src={suggestedVideo.videoFile}
              className="w-full aspect-video object-cover"
            />
            <div className="px-4 py-2">
              <h1 className="text-xl font-bold">{suggestedVideo.title}</h1>
              <p className="text-sm">{suggestedVideo.views} views</p>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>



  
  

  


  
  );
};

export default VideoPlayer;

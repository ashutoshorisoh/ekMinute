// src/Components/VideoList.jsx

import React, { useState, useEffect } from 'react';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/videos'); // Replace with your actual API endpoint
        const data = await response.json();
        setVideos(data.message.data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array means it runs once after the component mounts

  if (loading) {
    return <div className="text-center text-xl">Loading videos...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {videos.length > 0 ? (
        videos.map((video) => (
          <div key={video._id} className="video-item bg-black rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 ease-in-out  ">
            <div className="video-thumbnail relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
              <video  className="absolute top-0 left-0 w-full h-full object-contain pb-1">
                <source src={video.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 truncate bg-white">{video.title}</h3>
              {/*<p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>*/}
              <div className="mt-2 text-sm flex justify-between text-gray-500 bg-white">
               {/*} <p>Duration: {video.time} seconds</p>*/}
                <p>{video.owner[0]?.username || 'Unknown'}</p>
                <p>Views: {video.views}</p>
               {/*} <p>Published: {video.isPublished ? 'Yes' : 'No'}</p>*/}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-xl">No videos available.</p>
      )}
    </div>
  );
};

export default VideoList;

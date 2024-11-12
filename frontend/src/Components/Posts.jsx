import React, { useState } from 'react';

function Posts() {
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');

  // Handle file input change
  const handlePost = (e) => {
    const file = e.target.files[0];
    setPost(file);
  };

  // Handle the upload action
  const handleUpload = async () => {
    if (!post) {
      alert('Please select a post first');
      return;
    }

    // Create FormData object and append fields
    const formData = new FormData();
    formData.append('videoFile', post);
    formData.append('title', title);
    formData.append('username', "billubadmash")

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/post', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log('File upload failed');
      } else {
        console.log('File uploaded successfully');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <h1>Upload a Post</h1>
      <input type="file" onChange={handlePost} />
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Posts;

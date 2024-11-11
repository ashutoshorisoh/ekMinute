import React, { useState } from 'react';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the avatar is uploaded
    if (!avatar) {
      setErrorMessage('Avatar is required.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('username', username);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar); // Add avatar file

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered successfully:', data);
        // Redirect or show success message
      } else {
        setErrorMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error occurred while registering.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
      
      {errorMessage && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Fullname */}
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Avatar */}
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar (Profile Picture)</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

import React from 'react';
import { useForm } from 'react-hook-form';

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Login successful:', responseData);
      } else {
        console.log('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="bg-red-200 h-screen w-full flex justify-center items-center">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-md flex flex-col gap-6">
    <h2 className="text-3xl font-semibold text-gray-700 text-center">Login</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Username field */}
      <div className="flex flex-col">
        <label htmlFor="username" className="text-lg font-medium text-gray-600">Username</label>
        <input
          id="username"
          {...register('username', { required: 'Username is required' })}
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>

      {/* Password field */}
      <div className="flex flex-col">
        <label htmlFor="password" className="text-lg font-medium text-gray-600">Password</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
          className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Submit button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg w-full mt-4 hover:bg-blue-600 disabled:bg-gray-300"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>

  
  );
}

export default Login;

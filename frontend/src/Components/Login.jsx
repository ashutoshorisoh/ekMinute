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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username field */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        {/* Submit button */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

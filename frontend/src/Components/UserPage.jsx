import { useState, useEffect } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/userlist'); // Adjust URL accordingly
        const data = await response.json();

        if (data.success) {
          // Filter out only the username and avatar fields
          const filteredUsers = data.data.map(user => ({
            username: user.username,
            avatar: user.avatar,
          }));
          setUsers(filteredUsers); // Set the filtered data
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.username}> {/* Use username as the unique key */}
            <p>{user.username}</p>
            <img src={user.avatar} alt={user.username} width="50" height="50" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;

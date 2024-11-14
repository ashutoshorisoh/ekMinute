import { useState } from 'react';
import Register from './Components/Register';
import Login from './Components/Login';
import Posts from './Components/Posts';
import UsersPage from './Components/UserPage';
import VideoList from './Components/VideoList';

// Import the UserProvider from context
import { UserProvider } from './context/UserContext';

function App() {
  return (
    // Wrap your components with UserProvider
    <UserProvider>
      <div>
        <Posts />
        {/* Other components can also go here, such as <Login /> */}
      </div>
    </UserProvider>
  );
}

export default App;

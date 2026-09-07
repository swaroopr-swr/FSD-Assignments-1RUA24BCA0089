import React, { useState } from 'react';
import { users } from '../data/users';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term in real-time
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lab-component">
      <h3>Search Component</h3>
      <input 
        type="text" 
        className="search-input"
        placeholder="Search users by name..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="search-results">
        {filteredUsers.map(user => (
          <li key={user.id}>{user.name} ({user.city})</li>
        ))}
        {filteredUsers.length === 0 && <li>No users found.</li>}
      </ul>
    </div>
  );
};

export default UserSearch;

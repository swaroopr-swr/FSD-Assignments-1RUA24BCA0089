import React from 'react';
import { users } from '../data/users';
import UserCard from '../components/UserCard';

const EvenUsers = () => {
  // Filter for even IDs (user.id % 2 === 0)
  const evenUsers = users.filter(user => user.id % 2 === 0);

  return (
    <div className="page-container">
      <h2>Even ID Users</h2>
      <p>Displaying only users whose IDs are completely divisible by 2.</p>
      <div className="users-grid">
        {evenUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default EvenUsers;

import React from 'react';
import { users } from '../data/users';
import UserCard from '../components/UserCard';

const OddUsers = () => {
  // Filter for odd IDs (user.id % 2 !== 0)
  const oddUsers = users.filter(user => user.id % 2 !== 0);

  return (
    <div className="page-container">
      <h2>Odd ID Users</h2>
      <p>Displaying only users whose IDs are NOT completely divisible by 2.</p>
      <div className="users-grid">
        {oddUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default OddUsers;

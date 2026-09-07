import React from 'react';
import { users } from '../data/users';
import UserCard from '../components/UserCard';

const AllUsers = () => {
  return (
    <div className="page-container">
      <h2>All Users</h2>
      <div className="users-grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

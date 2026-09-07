import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-id">ID: {user.id}</div>
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>City:</strong> {user.city}</p>
    </div>
  );
};

export default UserCard;

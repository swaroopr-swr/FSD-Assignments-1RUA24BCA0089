import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import PostGrid from '../components/shared/PostGrid';
import GridTile from '../components/shared/GridTile';
import EmptyState from '../components/ui/EmptyState';
import { currentUser, users, mockPosts } from '../data/mockData';

const ProfilePage = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  
  // Find user or default to current user if not found (for demo)
  const user = users.find(u => u.username === username) || currentUser;
  const isCurrentUser = user.username === currentUser.username;
  
  // Mock user posts
  const userPosts = mockPosts.filter(p => p.author.username === user.username);

  return (
    <div className="pb-4">
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
      <ProfileTabs activeTab={activeTab} onSelect={setActiveTab} />
      
      {activeTab === 'posts' && (
        userPosts.length > 0 ? (
          <PostGrid>
            {userPosts.map((post, i) => (
              <GridTile key={`${post._id}-${i}`} post={post} />
            ))}
          </PostGrid>
        ) : (
          <EmptyState message="NO POSTS YET" />
        )
      )}

      {activeTab === 'saved' && (
        <EmptyState message="NO SAVED POSTS" />
      )}

      {activeTab === 'liked' && (
        <EmptyState message="NO LIKED POSTS" />
      )}
    </div>
  );
};

export default ProfilePage;

import React from 'react';
import PostCard from '../components/post/PostCard';
import EmptyState from '../components/ui/EmptyState';
import { mockPosts } from '../data/mockData';

const SavedPage = () => {
  // Mock just one saved post for demo
  const savedPosts = [mockPosts[1]];

  return (
    <div className="pb-4">
      <h1 className="mb-4" style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem' }}>Saved Posts</h1>
      {savedPosts.length > 0 ? (
        savedPosts.map(post => <PostCard key={post._id} post={post} />)
      ) : (
        <div className="mt-5 pt-5">
          <EmptyState message="YOU HAVEN'T SAVED ANY POSTS YET" />
        </div>
      )}
    </div>
  );
};

export default SavedPage;

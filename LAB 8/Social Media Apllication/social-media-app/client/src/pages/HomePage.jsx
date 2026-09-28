import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ComposerBar from '../components/post/ComposerBar';
import PostCard from '../components/post/PostCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { getPosts } from '../services/api';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts();
      setPosts(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch posts. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Refetch when returning from create post or navigation change
  useEffect(() => {
    fetchPosts();
  }, [location.key]);

  const handlePostDeleted = (id) => {
    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div className="pb-4">
      <ComposerBar />
      
      {error && (
        <div className="alert alert-danger m-label mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <>
          <Skeleton />
          <Skeleton />
        </>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            onDelete={() => handlePostDeleted(post._id)}
          />
        ))
      ) : (
        !error && <EmptyState message="NO POSTS YET. BE THE FIRST!" />
      )}
    </div>
  );
};

export default HomePage;

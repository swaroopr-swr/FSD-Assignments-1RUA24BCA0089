import React, { useState } from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import Avatar from '../ui/Avatar';
import StampButton from '../ui/StampButton';
import PerforatedDivider from '../ui/PerforatedDivider';
import { formatTime } from '../../utils/formatTime';
import { updatePost, deletePost } from '../../services/api';
import { currentUser } from '../../data/mockData';

const PostCard = ({ post, onDelete }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fallback to current user if the backend post has no author field
  const author = post.author || currentUser;

  const toggleLike = async () => {
    const previousLiked = liked;
    const previousCount = likesCount;
    
    // Optimistic UI update
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    try {
      // Assuming PUT always increments in the backend as per instructions
      await updatePost(post._id);
    } catch (err) {
      console.error('Failed to like post:', err);
      // Revert if API fails
      setLiked(previousLiked);
      setLikesCount(previousCount);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post._id);
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete post:', err);
      setIsDeleting(false);
    }
  };

  const renderContent = (text) => {
    if (!text) return null;
    return text.split(/(\s+)/).map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} style={{ color: 'var(--m-rust)' }}>{word}</span>;
      }
      return word;
    });
  };

  if (isDeleting) return null;

  return (
    <Card className="mb-4">
      <Card.Body className="p-3 p-md-4">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <Avatar src={author.avatarUrl} name={author.displayName} size="md" className="me-3" />
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div className="text-truncate" style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700, fontSize: '1rem' }}>
              {author.displayName}
            </div>
            <div className="m-label text-truncate text-lowercase">@{author.username}</div>
          </div>
          <div className="d-flex align-items-center">
            <span className="m-label me-2 d-none d-sm-inline">{formatTime(post.createdAt)}</span>
            <Dropdown align="end">
              <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }} bsPrefix="p-1 border-0 bg-transparent text-secondary">
                <i className="bi bi-three-dots"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className="m-label"><i className="bi bi-pencil me-2"></i>Edit</Dropdown.Item>
                <Dropdown.Item className="m-label"><i className="bi bi-link-45deg me-2"></i>Copy link</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="m-label text-danger" onClick={handleDelete}>
                  <i className="bi bi-trash me-2"></i>Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Body */}
        <div className="mb-3" style={{ fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
          {renderContent(post.content)}
        </div>

        {post.imageUrl && (
          <div className="mb-3">
            <img 
              src={post.imageUrl} 
              alt="Post media" 
              style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: 'var(--m-radius-media)', border: '1px solid var(--m-line)' }} 
            />
          </div>
        )}

        {/* Stats */}
        <div className="m-label mb-2">
          {likesCount} LIKES &middot; {post.commentsCount || 0} COMMENTS
        </div>

        <PerforatedDivider />

        {/* Actions */}
        <div className="d-flex justify-content-between mt-2">
          <div className="d-flex gap-1 gap-sm-2">
            <StampButton variant="ghost" className="d-flex align-items-center" onClick={toggleLike}>
              <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'} fs-5 me-sm-2`} style={{ color: liked ? 'var(--m-rust)' : 'inherit', transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: liked ? 'scale(1.1)' : 'scale(1)' }}></i>
              <span className="d-none d-sm-inline">Like</span>
            </StampButton>
            
            <StampButton variant="ghost" className="d-flex align-items-center">
              <i className="bi bi-chat fs-5 me-sm-2"></i>
              <span className="d-none d-sm-inline">Comment</span>
            </StampButton>
            
            <StampButton variant="ghost" className="d-flex align-items-center">
              <i className="bi bi-send fs-5 me-sm-2"></i>
              <span className="d-none d-sm-inline">Share</span>
            </StampButton>
          </div>
          
          <StampButton variant="ghost">
            <i className="bi bi-bookmark fs-5"></i>
          </StampButton>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;

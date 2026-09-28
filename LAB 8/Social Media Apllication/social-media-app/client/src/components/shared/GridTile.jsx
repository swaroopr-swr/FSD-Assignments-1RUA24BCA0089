import React from 'react';
import { Col } from 'react-bootstrap';

const GridTile = ({ post }) => {
  const hasImage = post.imageUrl;
  
  return (
    <Col xs={6} md={4} lg={3} className="mb-1 mb-md-0">
      <div 
        style={{ 
          aspectRatio: '1 / 1', 
          backgroundColor: hasImage ? 'transparent' : 'var(--m-paper-2)',
          backgroundImage: hasImage ? `url(${post.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          border: '1px solid var(--m-line)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        className="grid-tile"
      >
        {!hasImage && (
          <div className="p-3 w-100 h-100 d-flex flex-column justify-content-center">
            <p className="text-truncate" style={{ fontFamily: 'var(--m-font-serif)', fontSize: '0.85rem', maxHeight: '100%', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.content}
            </p>
          </div>
        )}
        {/* Hover overlay via CSS would normally go here, simplified inline for now */}
        <div 
          className="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100"
          style={{ backgroundColor: 'rgba(31,27,22,0.6)', transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.classList.replace('opacity-0', 'opacity-100')}
          onMouseLeave={(e) => e.currentTarget.classList.replace('opacity-100', 'opacity-0')}
        >
          <div className="d-flex text-white m-label gap-3">
            <span><i className="bi bi-heart-fill me-1 text-white"></i>{post.likes}</span>
            <span><i className="bi bi-chat-fill me-1 text-white"></i>{post.commentsCount}</span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default GridTile;

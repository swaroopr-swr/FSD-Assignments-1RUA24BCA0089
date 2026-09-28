import React from 'react';
import { Card } from 'react-bootstrap';
import Avatar from '../ui/Avatar';
import StampButton from '../ui/StampButton';

const ProfileHeader = ({ user, isCurrentUser }) => {
  return (
    <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: 'var(--m-card)', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Cover Image */}
      <div 
        style={{ 
          height: '200px', 
          backgroundColor: 'var(--m-paper-2)', 
          backgroundImage: 'radial-gradient(rgba(31,27,22,.09) 1px, transparent 1px)',
          backgroundSize: '22px 22px'
        }} 
        className="d-none d-md-block"
      ></div>
      <div 
        style={{ 
          height: '140px', 
          backgroundColor: 'var(--m-paper-2)', 
          backgroundImage: 'radial-gradient(rgba(31,27,22,.09) 1px, transparent 1px)',
          backgroundSize: '22px 22px'
        }} 
        className="d-block d-md-none"
      ></div>

      <Card.Body className="position-relative px-4 pb-4" style={{ paddingTop: '50px' }}>
        {/* Avatar overlapping cover */}
        <div className="position-absolute" style={{ top: '-48px', left: '24px' }}>
          <div className="d-none d-md-block">
            <Avatar src={user.avatarUrl} name={user.displayName} size="xl" />
          </div>
          <div className="d-block d-md-none">
            <Avatar src={user.avatarUrl} name={user.displayName} size="lg" />
          </div>
        </div>

        {/* Action Button */}
        <div className="position-absolute" style={{ top: '16px', right: '24px' }}>
          {isCurrentUser ? (
            <StampButton variant="outline">EDIT PROFILE</StampButton>
          ) : (
            <StampButton variant="primary">FOLLOW</StampButton>
          )}
        </div>

        <div className="mt-3">
          <h1 style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
            {user.displayName}
          </h1>
          <div className="m-label text-lowercase mb-3">@{user.username}</div>
          <p style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px' }}>
            {user.bio}
          </p>
        </div>

        {/* Stats Row */}
        <div className="d-flex mt-4 gap-4 gap-md-5">
          <div>
            <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.5rem', fontWeight: 700 }}>{user.postsCount}</div>
            <div className="m-label">POSTS</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.5rem', fontWeight: 700 }}>{user.followers}</div>
            <div className="m-label">FOLLOWERS</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.5rem', fontWeight: 700 }}>{user.following}</div>
            <div className="m-label">FOLLOWING</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileHeader;

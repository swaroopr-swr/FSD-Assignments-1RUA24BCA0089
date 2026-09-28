import React from 'react';
import SectionCard from '../components/ui/SectionCard';
import Avatar from '../components/ui/Avatar';
import StampButton from '../components/ui/StampButton';
import { trendingTopics, users, recentActivity } from '../data/mockData';

const RightSidebar = () => {
  return (
    <div>
      <SectionCard title="TRENDING">
        {trendingTopics.map((topic, index) => (
          <div key={topic.id} className="d-flex align-items-start mb-3">
            {index === 0 && <i className="bi bi-fire me-2 mt-1" style={{ color: 'var(--m-ochre)' }}></i>}
            <div>
              <div style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700, color: 'var(--m-rust-dark)' }}>
                #{topic.tag}
              </div>
              <div className="m-label" style={{ fontSize: '0.65rem' }}>{topic.count}</div>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="SUGGESTED">
        {users.slice(1, 4).map(user => (
          <div key={user._id} className="d-flex align-items-center mb-3">
            <Avatar src={user.avatarUrl} name={user.displayName} size="sm" className="me-2" />
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <div className="text-truncate" style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700, fontSize: '0.9rem' }}>{user.displayName}</div>
              <div className="m-label text-truncate" style={{ fontSize: '0.65rem' }}>@{user.username}</div>
            </div>
            <StampButton variant="outline" size="sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>
              FOLLOW
            </StampButton>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="RECENT ACTIVITY">
        {recentActivity.map(activity => (
          <div key={activity.id} className="mb-3 border-start border-2 px-2" style={{ borderColor: 'var(--m-line)' }}>
            <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '0.9rem' }}>{activity.text}</div>
            <div className="m-label" style={{ fontSize: '0.65rem' }}>{activity.time}</div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
};

export default RightSidebar;

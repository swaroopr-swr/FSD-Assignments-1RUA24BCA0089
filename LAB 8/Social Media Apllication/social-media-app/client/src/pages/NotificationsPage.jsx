import React from 'react';
import SectionCard from '../components/ui/SectionCard';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import { recentActivity } from '../data/mockData';

const NotificationsPage = () => {
  return (
    <div className="pb-4">
      <h1 className="mb-4" style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem' }}>Notifications</h1>
      <SectionCard title="RECENT">
        {recentActivity.map(activity => (
          <div key={activity.id} className="d-flex align-items-center mb-4">
            <Avatar size="sm" className="me-3" />
            <div>
              <div style={{ fontFamily: 'var(--m-font-serif)', fontSize: '1.05rem' }}>{activity.text}</div>
              <div className="m-label">{activity.time}</div>
            </div>
          </div>
        ))}
      </SectionCard>
      
      <SectionCard title="EARLIER">
        <EmptyState message="NO EARLIER NOTIFICATIONS" />
      </SectionCard>
    </div>
  );
};

export default NotificationsPage;

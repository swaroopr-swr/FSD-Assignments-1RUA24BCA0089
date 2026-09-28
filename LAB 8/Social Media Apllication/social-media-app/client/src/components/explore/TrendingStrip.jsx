import React from 'react';
import { Card } from 'react-bootstrap';

const TrendingStrip = () => {
  const items = [
    { id: 1, title: 'Final Exams Week', image: 'https://picsum.photos/seed/exam/400/300', likes: '12K' },
    { id: 2, title: 'Hackathon 2026', image: 'https://picsum.photos/seed/hack/400/300', likes: '8.4K' },
    { id: 3, title: 'Campus Fest', image: 'https://picsum.photos/seed/fest/400/300', likes: '5K' },
  ];

  return (
    <div className="d-flex overflow-auto mb-4 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', gap: '16px', snapType: 'x mandatory' }}>
      {items.map(item => (
        <Card key={item.id} className="flex-shrink-0" style={{ width: '280px', scrollSnapAlign: 'start', borderRadius: '16px', border: '1px solid var(--m-line)', overflow: 'hidden' }}>
          <div style={{ height: '140px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <Card.Body className="p-3">
            <div style={{ fontFamily: 'var(--m-font-serif)', fontWeight: 700, fontSize: '1.1rem' }}>{item.title}</div>
            <div className="m-label mt-1" style={{ color: 'var(--m-rust)' }}><i className="bi bi-fire me-1"></i>{item.likes} LIKES</div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TrendingStrip;

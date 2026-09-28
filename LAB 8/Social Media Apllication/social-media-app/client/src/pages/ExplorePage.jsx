import React, { useState, useEffect } from 'react';
import SearchBar from '../components/explore/SearchBar';
import CategoryChips from '../components/explore/CategoryChips';
import TrendingStrip from '../components/explore/TrendingStrip';
import PostGrid from '../components/shared/PostGrid';
import GridTile from '../components/shared/GridTile';
import { mockPosts } from '../data/mockData';

const ExplorePage = () => {
  // Use mock posts multiple times to fill the grid
  const gridPosts = [...mockPosts, ...mockPosts, ...mockPosts];

  return (
    <div className="pb-4">
      <div className="mb-4 d-none d-md-block">
        <h1 style={{ fontFamily: 'var(--m-font-serif)', fontSize: '2rem' }}>Explore</h1>
        <div className="m-label">DISCOVER TRENDING TOPICS AND CONVERSATIONS</div>
      </div>
      
      <SearchBar />
      <CategoryChips />
      <TrendingStrip />
      
      <div className="mt-4">
        <PostGrid>
          {gridPosts.map((post, i) => (
            <GridTile key={`${post._id}-${i}`} post={post} />
          ))}
        </PostGrid>
      </div>
    </div>
  );
};

export default ExplorePage;

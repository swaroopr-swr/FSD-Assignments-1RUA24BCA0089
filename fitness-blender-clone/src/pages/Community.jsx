import React from 'react';
import { MessageSquare, Heart, Share2 } from 'lucide-react';

const discussions = [
  { user: "SarahM", time: "2 hours ago", title: "Just finished FB Fit Round 3!", likes: 24, replies: 5 },
  { user: "FitnessJourney", time: "5 hours ago", title: "Recommendations for knee-friendly cardio?", likes: 12, replies: 8 },
  { user: "Mike_T", time: "1 day ago", title: "Meal prep Sunday - what are you making?", likes: 45, replies: 22 },
];

export default function Community() {
  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Community</h1>
            <p className="text-gray-600 mt-1">Connect, motivate, and share with the FB Family.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">New Post</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-4">
        {discussions.map((post, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow-sm border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
              <span className="font-bold text-gray-700 mr-2">{post.user}</span>
              <span>• {post.time}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600">{post.title}</h2>
            <div className="flex items-center space-x-6 text-gray-500 font-semibold text-sm">
              <span className="flex items-center hover:text-red-500"><Heart size={16} className="mr-1" /> {post.likes}</span>
              <span className="flex items-center hover:text-blue-600"><MessageSquare size={16} className="mr-1" /> {post.replies} Replies</span>
              <span className="flex items-center hover:text-gray-900"><Share2 size={16} className="mr-1" /> Share</span>
            </div>
          </div>
        ))}
        <button className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded hover:bg-gray-50 mt-8">
          Load More Discussions
        </button>
      </div>
    </div>
  );
}
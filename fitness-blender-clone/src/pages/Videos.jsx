import React from 'react';
import { Search, Filter, PlayCircle } from 'lucide-react';

const mockVideos = [
  { id: 1, title: 'Upper Body Strength Training', length: '40 Min', difficulty: '3/5', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
  { id: 2, title: 'HIIT Cardio and Core', length: '35 Min', difficulty: '4/5', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { id: 3, title: 'Lower Body Active Stretch', length: '20 Min', difficulty: '2/5', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80' },
  { id: 4, title: 'Kettlebell Strength', length: '45 Min', difficulty: '4/5', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80' },
  { id: 5, title: 'Low Impact Cardio', length: '25 Min', difficulty: '1/5', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { id: 6, title: 'Total Body Pilates', length: '30 Min', difficulty: '3/5', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' }
];

export default function Videos() {
  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-16 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-4xl font-extrabold text-[#1d2c3c] tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Workout Videos</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded shadow-sm p-4 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold uppercase tracking-wide text-sm text-[#1d2c3c]">Filters</h2>
              <Filter size={16} className="text-gray-500" />
            </div>

            <div className="space-y-6">
              {/* Filter Group */}
              <div>
                <h3 className="font-bold text-[#1d2c3c] mb-3 border-b pb-2">Difficulty</h3>
                <div className="space-y-3 mt-3">
                  {[1, 2, 3, 4, 5].map(level => (
                    <label key={level} className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" />
                      <span>Level {level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#1d2c3c] mb-3 border-b pb-2">Duration</h3>
                <div className="space-y-3 mt-3 text-sm text-gray-700">
                  <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /><span>&lt; 10 Min</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /><span>10 - 20 Min</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /><span>20 - 30 Min</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /><span>30 - 45 Min</span></label>
                  <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /><span>45+ Min</span></label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Video Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold text-gray-600">{mockVideos.length} Videos Found</span>
            <div className="relative">
              <input type="text" placeholder="Search videos..." className="pl-3 pr-10 py-2 border rounded shadow-sm text-sm focus:outline-blue-500 w-[250px]" />
              <Search size={16} className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVideos.map(video => (
              <div key={video.id} className="bg-white rounded shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative h-[200px] bg-gray-200">
                  <img src={video.image} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'; }} />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle size={56} className="text-white drop-shadow-md" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-[1.05rem] text-[#1d2c3c] mb-3 leading-snug group-hover:text-[#0070c9] transition-colors">{video.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wide">
                    <span>{video.length}</span>
                    <span>Level {video.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
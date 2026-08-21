import React from 'react';

export default function Membership() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1b263b] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight text-blue-400">FB Plus</h1>
        <p className="text-xl max-w-2xl mx-auto px-4 font-medium mb-10">
          The ultimate fitness experience. Get exclusive workout videos, programs, features, and an ad-free experience.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded">Start Free Trial</button>
          <button className="bg-transparent border border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded">View Pricing</button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Membership Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-lg p-8 flex flex-col">
            <h3 className="text-2xl font-black mb-2">Free</h3>
            <p className="text-4xl font-bold mb-6">$0<span className="text-sm text-gray-500 font-normal">/forever</span></p>
            <ul className="space-y-4 mb-8 flex-1 text-gray-700">
              <li className="flex items-start">✓ <span className="ml-2">Access to 600+ free workout videos</span></li>
              <li className="flex items-start">✓ <span className="ml-2">Community forums</span></li>
              <li className="flex items-start">✓ <span className="ml-2">Basic calendar tracking</span></li>
            </ul>
            <button className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded hover:bg-blue-50 transition-colors">Sign Up Free</button>
          </div>

          {/* Plus Tier */}
          <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-8 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase rounded-bl-lg">Most Popular</div>
            <h3 className="text-2xl font-black mb-2 text-blue-800">FB Plus</h3>
            <p className="text-4xl font-bold mb-6 text-blue-900">$8.99<span className="text-sm text-gray-500 font-normal">/month</span></p>
            <ul className="space-y-4 mb-8 flex-1 text-gray-800 font-medium">
              <li className="flex items-start text-blue-600">✓ <span className="ml-2 text-gray-800">Everything in Free</span></li>
              <li className="flex items-start text-blue-600">✓ <span className="ml-2 text-gray-800">Exclusive FB Plus Workout Videos</span></li>
              <li className="flex items-start text-blue-600">✓ <span className="ml-2 text-gray-800">All FB Plus Programs & Challenges</span></li>
              <li className="flex items-start text-blue-600">✓ <span className="ml-2 text-gray-800">Ads-Free Website and Videos</span></li>
              <li className="flex items-start text-blue-600">✓ <span className="ml-2 text-gray-800">Custom Workouts & Routines</span></li>
            </ul>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors">Start 7-Day Free Trial</button>
          </div>
        </div>
      </div>
    </div>
  );
}
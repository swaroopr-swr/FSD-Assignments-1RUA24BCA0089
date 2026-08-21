import React from 'react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16 prose prose-lg prose-blue">
        <h1 className="text-4xl font-black text-center mb-8">About Fitness Blender</h1>
        <img 
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1440&q=80" 
          alt="Fitness Blender Team" 
          className="rounded-lg shadow-md mb-12 w-full h-[400px] object-cover"
        />
        <h2 className="text-2xl font-bold mb-4">We believe fitness should be accessible to everyone, everywhere.</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Fitness Blender was created by personal trainers Kelli and Daniel Segars. We started Fitness Blender because we believed that fitness should be accessible to everyone, regardless of their income. We felt like there was a lack of reliable health and fitness information on the web, and too many people in the industry were more focused on appearance than they were on good health.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Over the years, we've built a library of hundreds of free full-length workout videos. We've also grown a team of incredible trainers, dietitians, and physical therapists to bring you the best possible content.
        </p>
        <div className="bg-blue-50 border border-blue-100 p-8 rounded-lg text-center mt-12">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Join our global community</h3>
          <p className="text-blue-800 mb-6">Start your journey today with our free videos or take it to the next level with FB Plus.</p>
          <a href="/membership" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded shadow-sm hover:bg-blue-700 transition-colors">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
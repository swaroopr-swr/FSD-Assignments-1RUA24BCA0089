import React from 'react';

const mockPrograms = [
  {
    category: "4 Week Program",
    title: "FB Fit: Round 3",
    subtitle: "8-Week Fat Loss Program to Lose Weight & Build Lean Muscle",
    duration: "8 Weeks",
    time: "45 Min/Day",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
  },
  {
    category: "2 Week Challenge",
    title: "Fitness Blender's Free 2 Week Challenge",
    subtitle: "Strength Training, Cardio, and Mobility Workouts for a Strong Body and Mind",
    duration: "2 Weeks",
    time: "31 Min/Day",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
  },
  {
    category: "1 Week Challenge",
    title: "Essentials with Erica",
    subtitle: "Beginner-Friendly Total Body Strength Training with Cardio",
    duration: "1 Week",
    time: "35 Min/Day",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80"
  }
];

export default function Programs() {
  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-3xl font-black text-gray-900">Workout Programs</h1>
          <p className="text-gray-600 mt-2">Professionally built plans to keep you on track.</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPrograms.map((plan, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{plan.category}</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col cursor-pointer group hover:-translate-y-1 transition-transform">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img src={plan.image} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{plan.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{plan.subtitle}</p>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase border-t pt-4">
                    <span>{plan.duration}</span>
                    <span>{plan.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
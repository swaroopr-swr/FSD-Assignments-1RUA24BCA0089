import React from 'react';

const articles = [
  {
    title: "10 Benefits of Daily Stretching",
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    desc: "Why you should be doing this every single day."
  },
  {
    title: "How to Build a Workout Routine",
    category: "Experts",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    desc: "A beginner's guide to putting together a balanced plan."
  },
  {
    title: "Protein Packed Smoothie Recipes",
    category: "Healthy Recipes",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80",
    desc: "Quick and easy recipes for post-workout recovery."
  }
];

export default function HealthyLiving() {
  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-16">
      <div className="bg-[#acc655] text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Healthy Living</h1>
        <p className="text-lg font-medium max-w-xl mx-auto px-4">Expert articles, recipes, and wellness tips to help you live a healthier, happier life.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer">
              <div className="h-56 bg-gray-200">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#acc655] uppercase tracking-wider">{article.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                <p className="text-gray-600">{article.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
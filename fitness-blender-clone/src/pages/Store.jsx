import React from 'react';

const products = [
  { name: "FB PowerBlock Dumbbells", price: "$200.00", image: "https://cloudfront.fitnessblender.com/assets/img/homepage/pb-50-1440.png" },
  { name: "FB Workout Mat", price: "$45.00", image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80" },
  { name: "Gift Card", price: "$25.00 - $100.00", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80" },
];

export default function Store() {
  return (
    <div className="bg-[#f4f7f8] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-3xl font-black text-gray-900">Fitness Blender Store</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, idx) => (
            <div key={idx} className="bg-white rounded p-4 shadow-sm group">
              <div className="bg-gray-100 aspect-video mb-4 overflow-hidden rounded">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-gray-600 mb-4">{p.price}</p>
              <button className="w-full border border-gray-900 text-gray-900 font-bold py-2 hover:bg-gray-900 hover:text-white transition-colors">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
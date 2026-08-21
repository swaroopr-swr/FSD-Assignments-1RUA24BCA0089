import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Fitness Blender</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              WORKOUT COMPLETE<span className="text-blue-500 font-bold">™</span>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">YT</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">PT</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">FB</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">IG</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">TW</a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4">Workouts</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Workout Videos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Workouts</a></li>
            </ul>
            
            <h3 className="font-bold uppercase tracking-wider mb-4 mt-8">Programs</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Workout Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Meal Plans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pilot Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Routines</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4">Healthy Living</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Fitness</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Health</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nutrition</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Healthy Recipes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Experts</a></li>
            </ul>

            <h3 className="font-bold uppercase tracking-wider mb-4 mt-8">About</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">B2B Options</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h3 className="font-bold uppercase tracking-wider mb-4">Membership</h3>
            
            <h3 className="font-bold uppercase tracking-wider mb-4 mt-8">Community</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>Copyright © 2024 Fitness Blender. All rights reserved. Terms and Conditions Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

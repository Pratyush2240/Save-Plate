import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-manrope">
      <nav className="flex justify-between items-center p-4 px-8 border-b border-gray-200">
        <div className="text-2xl font-extrabold text-saveplate-green">SavePlate</div>
        <div className="flex items-center gap-4">
          <Link to="/explore" className="text-sm font-semibold px-4 py-2 rounded-full bg-saveplate-light-green text-saveplate-green">Explore</Link>
          <Link to="/login" className="text-sm font-semibold px-4 py-2">Login</Link>
          <Link to="/signup" className="text-sm font-semibold px-4 py-2 rounded-full bg-saveplate-orange text-white">Join SavePlate!</Link>
        </div>
      </nav>
      <main className="flex flex-col items-center text-center max-w-3xl mx-auto pt-24 pb-16">
        <h1 className="text-6xl font-extrabold leading-tight">
          Rescue Surplus.
          <span className="text-saveplate-orange"> Cut Food Waste. </span>
          Enjoy Quality Meals.
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mt-6 mb-8">
          Connect with local restaurants to save perfectly good food from going to waste. Get quality meals at great prices while making a positive impact.
        </p>
        <div className="flex gap-4">
          <Link to="/explore" className="text-base font-bold px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-700">Explore Meals</Link>
          <Link to="/restaurant" className="text-base font-bold px-6 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">Join as Restaurant</Link>
        </div>
        <div className="flex gap-6 text-sm text-gray-500 mt-16">
          <span>• 2,50,000+ meals rescued</span>
          <span>• 850+ restaurant partners</span>
          <span>• Zero food waste mission</span>
        </div>
      </main>
    </div>
  );
}
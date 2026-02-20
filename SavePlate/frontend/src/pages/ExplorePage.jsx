import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDemoRestaurants } from '../demo/demoRestaurants';
import { isDemo, getCurrentUser } from '../demo/demoAuth';
import { createOrder } from '../demo/demoData';

export default function ExplorePage() {
  const navigate = useNavigate();
  const restaurants = useMemo(() => getDemoRestaurants(), []);

  const handleOrder = (restaurant, offer) => {
    if (!isDemo()) {
      alert('Explore ordering is available in demo mode only for now.');
      return;
    }
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'customer') {
      navigate('/restaurant');
      return;
    }
    const created = createOrder({
      customerId: user.uid,
      customerEmail: user.email,
      item: `${offer.name} @ ${restaurant.name}`,
      price: offer.price
    });
    navigate(`/checkout/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      <nav className="flex justify-between items-center p-4 px-8 border-b border-gray-200">
        <Link to="/" className="text-2xl font-extrabold text-saveplate-green">SavePlate</Link>
        <div className="flex items-center gap-4">
          <Link to="/explore" className="text-sm font-semibold px-4 py-2 rounded-full bg-saveplate-light-green text-saveplate-green">Explore</Link>
          <Link to="/login" className="text-sm font-semibold px-4 py-2">Login</Link>
          <Link to="/signup" className="text-sm font-semibold px-4 py-2 rounded-full bg-saveplate-orange text-white">Join SavePlate!</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6">Discover surplus meals near you</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map(r => (
            <div key={r.id} className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold">{r.name}</h2>
                  <p className="text-sm text-gray-500">{r.cuisine} • {r.city}</p>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                {r.offers.map(o => (
                  <div key={o.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                    <div>
                      <p className="font-semibold">{o.name}</p>
                      <p className="text-sm text-gray-500">Surplus pickup only</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">₹{o.price}</span>
                      <button onClick={() => handleOrder(r, o)} className="bg-saveplate-green text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-green-700">
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}



import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isDemo } from '../demo/demoAuth';
import { getOrderById, markOrderPaid } from '../demo/demoData';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(id), [id]);
  const [method, setMethod] = useState('upi');

  if (!isDemo()) {
    return (
      <div className="max-w-3xl mx-auto p-6 font-manrope">
        <p>Checkout is available in demo mode only for now.</p>
        <Link className="text-saveplate-green font-semibold" to="/">Go Home</Link>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6 font-manrope">
        <p>Order not found.</p>
        <Link className="text-saveplate-green font-semibold" to="/explore">Back to Explore</Link>
      </div>
    );
  }

  const onPay = () => {
    const updated = markOrderPaid(order.id, method);
    navigate(`/invoice/${updated.id}`);
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      <nav className="flex justify-between items-center p-4 px-8 border-b border-gray-200">
        <Link to="/" className="text-2xl font-extrabold text-saveplate-green">SavePlate</Link>
      </nav>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6">Checkout</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Item</span><span>{order.item}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Amount</span><span>₹{order.price}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Pickup</span><span>Pickup Only</span></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="radio" name="pm" checked={method==='upi'} onChange={() => setMethod('upi')} />
              <span>UPI</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="pm" checked={method==='card'} onChange={() => setMethod('card')} />
              <span>Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="radio" name="pm" checked={method==='cod'} onChange={() => setMethod('cod')} />
              <span>Pay at Pickup</span>
            </label>
          </div>
        </div>

        <button onClick={onPay} className="w-full bg-saveplate-green text-white font-bold py-3 rounded-lg hover:bg-green-700">Pay ₹{order.price}</button>
      </main>
    </div>
  );
}



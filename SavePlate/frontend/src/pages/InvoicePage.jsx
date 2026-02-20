import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../demo/demoData';

export default function InvoicePage() {
  const { id } = useParams();
  const order = useMemo(() => getOrderById(id), [id]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6 font-manrope">
        <p>Invoice not found.</p>
        <Link className="text-saveplate-green font-semibold" to="/">Go Home</Link>
      </div>
    );
  }

  const download = () => {
    const blob = new Blob([`Invoice\nOrder: ${order.id}\nItem: ${order.item}\nAmount: ₹${order.price}\nPayment: ${order.paymentStatus} via ${order.paymentMethod}\nRef: ${order.referenceId}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white font-manrope">
      <nav className="flex justify-between items-center p-4 px-8 border-b border-gray-200">
        <Link to="/" className="text-2xl font-extrabold text-saveplate-green">SavePlate</Link>
      </nav>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6">Invoice</h1>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Invoice ID</span><span>{order.referenceId || 'N/A'}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Order ID</span><span>{order.id}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Item</span><span>{order.item}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Amount</span><span>₹{order.price}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Payment</span><span>{order.paymentStatus} {order.paymentMethod ? `via ${order.paymentMethod}`: ''}</span></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={download} className="bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700">Download</button>
          <Link to="/customer" className="px-4 py-2 rounded-lg border border-gray-300">Go to My Orders</Link>
        </div>
      </main>
    </div>
  );
}



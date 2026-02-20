import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { isDemo, getCurrentUser, logout } from '../demo/demoAuth';
import { listOrdersByStatus, markOrderReady } from '../demo/demoData';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function RestaurantDashboard() {
  const [user, setUser] = useState(null);
  const [newOrders, setNewOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemo()) {
      const demoUser = getCurrentUser();
      if (!demoUser) { navigate('/'); return; }
      if (demoUser.role !== 'restaurant') { navigate('/customer'); return; }
      setUser(demoUser);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { navigate('/'); return; }
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) { navigate('/'); return; }
        const { role } = userSnap.data();
        if (role !== 'restaurant') { navigate('/customer'); return; }
        setUser(currentUser);
      } catch (e) {
        console.error('Failed to verify role', e);
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    if (isDemo()) {
      setNewOrders(listOrdersByStatus('new'));
      const id = setInterval(() => {
        setNewOrders(listOrdersByStatus('new'));
      }, 1000);
      return () => clearInterval(id);
    }
    const q = query(collection(db, "orders"), where("status", "==", "new"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setNewOrders(orders);
    });
    return () => unsubscribe();
  }, [user]);

  const handleMarkAsReady = async (orderId) => {
    try {
      if (isDemo()) {
        markOrderReady(orderId);
        setNewOrders(listOrdersByStatus('new'));
        return;
      }
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "ready_for_pickup" });
      alert("Order marked as ready!");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleLogout = () => {
    if (isDemo()) { logout(); navigate('/'); return; }
    signOut(auth).then(() => navigate('/'));
  };

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 font-manrope">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <button onClick={handleLogout} className="text-sm font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Log Out
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">New Orders</h2>
        {newOrders.length === 0 ? (
          <p className="text-gray-500">No new orders.</p>
        ) : (
          <ul className="space-y-4">
            {newOrders.map(order => (
              <li key={order.id} className="p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                <div>
                  Order from: <span className="font-semibold">{order.customerEmail}</span> - {order.item}
                </div>
                <button 
                  onClick={() => handleMarkAsReady(order.id)}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-saveplate-green text-white hover:bg-green-700"
                >
                  Mark as Ready for Pickup
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RestaurantDashboard;
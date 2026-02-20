import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { isDemo, getCurrentUser, logout } from '../demo/demoAuth';
import { createOrder, listOrdersByCustomer } from '../demo/demoData';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemo()) {
      const demoUser = getCurrentUser();
      if (!demoUser) { navigate('/'); return; }
      if (demoUser.role !== 'customer') { navigate('/restaurant'); return; }
      setUser(demoUser);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) { navigate('/'); return; }
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) { navigate('/'); return; }
        const { role } = userDocSnap.data();
        if (role !== 'customer') { navigate('/restaurant'); return; }
        setUser(currentUser);
      } catch (e) {
        console.error('Failed to fetch user role', e);
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    if (isDemo()) {
      setMyOrders(listOrdersByCustomer(user.uid));
      const id = setInterval(() => {
        setMyOrders(listOrdersByCustomer(user.uid));
      }, 1000);
      return () => clearInterval(id);
    }
    const q = query(collection(db, "orders"), where("customerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      setMyOrders(orders);
    });
    return () => unsubscribe();
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    try {
      if (isDemo()) {
        const created = createOrder({ customerId: user.uid, customerEmail: user.email, item: 'Surplus Meal', price: 100 });
        setMyOrders(listOrdersByCustomer(user.uid));
        navigate(`/checkout/${created.id}`);
        return;
      }
      await addDoc(collection(db, "orders"), {
        customerId: user.uid,
        customerEmail: user.email,
        item: "Surplus Meal",
        price: 100,
        status: "new",
        createdAt: new Date()
      });
      alert("Order placed!");
    } catch (e) {
      console.error("Error adding document: ", e);
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
        <h1 className="text-3xl font-bold">Welcome, Customer</h1>
        <button onClick={handleLogout} className="text-sm font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Log Out
        </button>
      </div>
      <div className="p-6 bg-gray-50 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Place a New Order</h2>
        <button onClick={handlePlaceOrder} className="bg-saveplate-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700">
          Place ₹100 Order
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {myOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {myOrders.map(order => (
              <li key={order.id} className="p-4 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold">{order.item}</span> - ₹{order.price}
                </div>
                <strong className={`capitalize px-3 py-1 rounded-full text-sm
                  ${order.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'ready_for_pickup' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {order.status.replace('_', ' ')}
                </strong>
                {order.status === 'ready_for_pickup' && (
                  <strong className="text-saveplate-green"> - Your QR code for verification!</strong>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
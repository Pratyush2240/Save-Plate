import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. Import the new CSS file
import './index.css'; 

// 2. Import all your pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerDashboard from './pages/CustomerDashboard';
import RestaurantDashboard from './pages/RestaurantsDashbboard';
import ExplorePage from './pages/ExplorePage';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';
// 3. Set up the full router
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/explore",
    element: <ExplorePage />,
  },
  {
    path: "/checkout/:id",
    element: <CheckoutPage />,
  },
  {
    path: "/invoice/:id",
    element: <InvoicePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/customer",
    element: <CustomerDashboard />,
  },
  {
    path: "/restaurant",
    element: <RestaurantDashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
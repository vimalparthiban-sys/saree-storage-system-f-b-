import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import TrackOrder from './pages/TrackOrder';
import ContactUs from './pages/ContactUs';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import CustomerOrders from './pages/CustomerOrders';
import Account from './pages/Account';

// Global Modals and Drawers (Always accessible from Navbar everywhere)
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';

// Scrolls window to top whenever navigation route or query parameter changes
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          {/* Main Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-orders" element={<CustomerOrders />} />
            <Route path="/account" element={<Account />} />
            <Route path="/profile" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Interactive Elements: Cart Drawer, Checkout, & Login */}
          <CartDrawer />
          <CheckoutModal />
          <AuthModal />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

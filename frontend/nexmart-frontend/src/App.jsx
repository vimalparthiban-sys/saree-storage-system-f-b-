import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('saree_store_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('saree_store_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse orders:', e);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('saree_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('saree_store_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, openDrawer = true) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.packId === product.packId && item.color === product.color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProductFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData) => {
    const awbNum = 'AWB-DEL-' + Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      awb: awbNum,
      courier: 'Delhivery Express',
      ...orderData,
      items: [...cart],
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      trackingEvents: [
        {
          status: 'CONFIRMED',
          title: 'Order Confirmed & Payment Verified',
          time: `${nowTime}, Today`,
          location: 'APPZYS Central Online Gateway',
          done: true
        }
      ],
      whatsappLogs: [
        {
          stage: 'ORDER_PLACED',
          time: nowTime,
          message: `Namaste ${orderData.customerName || 'Customer'}! 📦 Your APPZYS order #${orderId} (Total: ₹${orderData.totalAmount}) is confirmed! We are preparing your order for express dispatch. Courier: Delhivery Express (AWB: ${awbNum}). Live tracking: https://appzys.com/track-order?awb=${awbNum}. Support: +91 98400 12345.`
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send real order to Spring Boot + MySQL Backend
    api.createOrder({
      customerName: orderData.customerName || 'Customer',
      phone: orderData.phone || '9840012345',
      address: orderData.address || 'Chennai, Tamil Nadu',
      totalAmount: orderData.totalAmount || cartTotal,
      paymentMethod: orderData.paymentMethod || 'UPI',
      items: cart.map((item) => ({
        productId: item.id,
        title: item.title,
        packName: item.packName || 'Pack of 1',
        color: item.color || 'Standard',
        quantity: item.quantity || 1,
        price: item.price || 499
      }))
    }).then((res) => {
      console.log('✅ Real order persisted in MySQL via Spring Boot:', res);
    }).catch((err) => {
      console.warn('Backend unavailable, order kept in localStorage fallback:', err);
    });

    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, courier = null) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedCourier = courier || ord.courier || 'Delhivery Express';
          const updatedAwb = ord.awb || ('AWB-DEL-' + Math.floor(100000 + Math.random() * 900000));
          const existingEvents = ord.trackingEvents ? [...ord.trackingEvents] : [];
          const existingLogs = ord.whatsappLogs ? [...ord.whatsappLogs] : [];

          let newEvent = null;
          let newWhatsapp = null;

          if (newStatus === 'PACKED') {
            newEvent = {
              status: 'PACKED',
              title: 'Quality Check Passed & Sealed with Protective Air Cushioning',
              time: `${nowTime}, Today`,
              location: 'APPZYS Chennai Warehouse',
              done: true
            };
            newWhatsapp = {
              stage: 'PACKED',
              time: nowTime,
              message: `✅ Order #${ord.id} Packed! High-grade stainless steel frame & moisture-proof fabric verified. Dispatching to ${updatedCourier} courier partner shortly.`
            };
          } else if (newStatus === 'SHIPPED') {
            newEvent = {
              status: 'SHIPPED',
              title: `Dispatched & Handed over to ${updatedCourier} (AWB: ${updatedAwb})`,
              time: `${nowTime}, Today`,
              location: 'Guindy Sorting Hub, Chennai',
              done: true
            };
            newWhatsapp = {
              stage: 'DISPATCHED',
              time: nowTime,
              message: `🚀 Dispatched! Your package is in transit via ${updatedCourier} (AWB: ${updatedAwb}). Live tracking: https://appzys.com/track-order?awb=${updatedAwb}. Expected delivery in 1-2 business days!`
            };
          } else if (newStatus === 'OUT_FOR_DELIVERY') {
            newEvent = {
              status: 'OUT_FOR_DELIVERY',
              title: `Out for Doorstep Delivery - Delivery Partner on Route`,
              time: `${nowTime}, Today`,
              location: 'Destination Local Hub (Rider Assigned)',
              done: true
            };
            newWhatsapp = {
              stage: 'OUT_FOR_DELIVERY',
              time: nowTime,
              message: `🚚 Out for Delivery! Rider will deliver your APPZYS package today. Please keep your phone available for delivery verification.`
            };
          } else if (newStatus === 'DELIVERED') {
            newEvent = {
              status: 'DELIVERED',
              title: 'Package Successfully Delivered to Customer',
              time: `${nowTime}, Today`,
              location: 'Customer Doorstep',
              done: true
            };
            newWhatsapp = {
              stage: 'DELIVERED',
              time: nowTime,
              message: `🎉 Delivered! Thank you for ordering from APPZYS Smart Storage. Enjoy your organized wardrobe! Please reach out to our WhatsApp support (+91 98400 12345) for any setup assistance.`
            };
          } else if (newStatus === 'DELAYED') {
            newEvent = {
              status: 'DELAYED',
              title: 'Regional Route Delay Encountered - Insurance Claim Protection Triggered',
              time: `${nowTime}, Today`,
              location: 'National Highway Transit Checkpoint',
              done: true,
              isAlert: true
            };
            newWhatsapp = {
              stage: 'TRANSIT_ALERT',
              time: nowTime,
              message: `⚠️ Transit Update: Your package has encountered a short regional route delay. Our APPZYS dedicated support team is actively tracking it with ${updatedCourier}. Replacement guarantee is active. WhatsApp Support: +91 98400 12345.`
            };
          }

          if (newEvent && !existingEvents.some((e) => e.status === newStatus)) {
            existingEvents.push(newEvent);
          }
          if (newWhatsapp) {
            existingLogs.push(newWhatsapp);
          }

          return {
            ...ord,
            status: newStatus,
            courier: updatedCourier,
            awb: updatedAwb,
            trackingEvents: existingEvents,
            whatsappLogs: existingLogs
          };
        }
        return ord;
      })
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeProductFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        orders,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMenuItems, initialTables, initialOrders } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  playNewOrderBuzzer, 
  playOrderReadyBuzzer, 
  playWaiterCallBuzzer 
} from '../utils/audioAlerts';

const RestaurantContext = createContext(null);

import { formatINR } from '../utils/currency';

export const RestaurantProvider = ({ children }) => {
  // Menu items (Synced between Admin & Customer with INR support)
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('vb_menu_items_inr');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  // Table management
  const [tables, setTables] = useState(() => {
    const saved = localStorage.getItem('vb_tables_inr');
    return saved ? JSON.parse(saved) : initialTables;
  });

  // KDS Live Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('vb_orders_inr');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Current customer active table
  const [activeTable, setActiveTable] = useState({
    number: '04',
    zone: 'Indoor Center'
  });

  // Customer Shopping Cart: { [itemId]: { item, qty, notes, options } }
  const [cart, setCart] = useState({
    'm1': { item: initialMenuItems[0], qty: 1, notes: 'Gluten-Free, Rare' },
    'm4': { item: initialMenuItems[3], qty: 2, notes: 'Light ice' },
    'm3': { item: initialMenuItems[2], qty: 1, notes: 'Standard' }
  });

  // Toast / System Notifications
  const [toast, setToast] = useState(null);
  const [emergencyHold, setEmergencyHold] = useState(false);

  // Sound Alerts Toggle (New Orders Buzzer, Ready Bells)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('vb_sound_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vb_sound_enabled', String(soundEnabled));
    } catch (e) {}
  }, [soundEnabled]);

  // Admin Authentication State
  const [adminAuth, setAdminAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('vb_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginAdmin = (adminData, remember = true) => {
    const session = {
      isAuthenticated: true,
      name: adminData.name || 'Prashant',
      email: adminData.email || 'prashant.owner@velvetbloom.com',
      role: adminData.role || 'General Manager & Operating Partner',
      branch: 'Velvet Bloom • Cyber City Flagship',
      gstin: '07AAAAA0000A1Z5',
      fssai: '10019011000432',
      terminal: 'POS-TERMINAL-01',
      ...adminData,
      id: '9586784989' // Permanently locked ID
    };
    setAdminAuth(session);
    if (remember) {
      localStorage.setItem('vb_admin_auth', JSON.stringify(session));
    }
    showToast(`Welcome back, ${session.name}! Terminal unlocked.`, 'success');
  };

  const logoutAdmin = () => {
    setAdminAuth(null);
    localStorage.removeItem('vb_admin_auth');
    showToast('Terminal session locked. Switched to public view.', 'info');
  };

  const updateAdminProfile = (updatedData) => {
    setAdminAuth(prev => {
      const updated = {
        ...(prev || {}),
        ...updatedData,
        id: '9586784989', // Cannot be altered
        isAuthenticated: true
      };
      try {
        localStorage.setItem('vb_admin_auth', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Admin profile & restaurant credentials saved!', 'success');
  };

  // Cross-Tab & Cross-Device Audio Broadcast Listener
  // When customer places order in one tab or phone, admin laptop & kitchen monitors ring immediately!
  useEffect(() => {
    let channel = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('vb_restaurant_live_bus');
        channel.onmessage = (event) => {
          const { type, order, orderId, tableNumber } = event.data || {};
          
          if (type === 'NEW_ORDER_ALERT' && order) {
            // Sound the kitchen / admin ticket alert
            if (soundEnabled) {
              playNewOrderBuzzer();
            }
            // Add to live orders if not already present
            setOrders(prev => {
              if (prev.some(o => o.id === order.id)) return prev;
              return [order, ...prev];
            });
            showToast(`🔔 NEW ORDER: Table ${order.tableNumber} (#${order.id}) placed! Firing in kitchen.`, 'success', 'View KDS');
          } else if (type === 'ORDER_READY_ALERT') {
            // Sound distinct Waiter Staff / Runner pickup bell
            if (soundEnabled) {
              playOrderReadyBuzzer();
            }
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
            showToast(`🍽️ ORDER READY: Table ${tableNumber} is plated & hot at pass! Runners alerted.`, 'warning');
          } else if (type === 'CALL_WAITER_ALERT') {
            // Sound service summon chime
            if (soundEnabled) {
              playWaiterCallBuzzer();
            }
            showToast(`🛎️ Table ${tableNumber} requested a server at their table!`, 'info');
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or restricted:', e);
    }

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch (e) {}
      }
    };
  }, [soundEnabled]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vb_menu_items_inr', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('vb_tables_inr', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('vb_orders_inr', JSON.stringify(orders));
  }, [orders]);

  // Show toast notification
  const showToast = (message, type = 'info', action = null) => {
    setToast({ message, type, action });
    setTimeout(() => setToast(null), 4500);
  };

  // Toggle dish 86'd out of stock
  const toggleItemAvailability = (id) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.isAvailable;
        showToast(
          nextState ? `Restocked "${item.name}"!` : `86'd "${item.name}" (Marked Sold Out)`,
          nextState ? 'success' : 'warning'
        );
        return { ...item, isAvailable: nextState };
      }
      return item;
    }));
  };

  // Add new dish from Admin Dish Builder
  const addMenuItem = (newDish) => {
    const dish = {
      ...newDish,
      id: 'm_' + Date.now(),
      soldCount: 0,
      isAvailable: true
    };
    setMenuItems(prev => [dish, ...prev]);
    showToast(`Published "${dish.name}" to digital QR menus!`, 'success');
  };

  // Cart operations
  const updateCartQty = (itemId, delta) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing && delta > 0) {
        const item = menuItems.find(m => m.id === itemId);
        if (!item) return prev;
        return { ...prev, [itemId]: { item, qty: 1, notes: '' } };
      }
      if (!existing) return prev;

      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...existing, qty: newQty }
      };
    });
  };

  const addToCartWithOptions = (item, options = {}) => {
    setCart(prev => {
      const existing = prev[item.id] || { item, qty: 0 };
      return {
        ...prev,
        [item.id]: {
          item,
          qty: existing.qty + 1,
          notes: options.notes || '',
          options
        }
      };
    });
    showToast(`Added ${item.name} to Table ${activeTable.number} order!`, 'success');
  };

  // Submit order from Customer QR view
  const submitOrder = (specialRequest = '', splitBill = false) => {
    if (emergencyHold) {
      showToast('Kitchen is currently at peak capacity. Digital orders temporarily paused.', 'error');
      return false;
    }

    const cartEntries = Object.values(cart);
    if (cartEntries.length === 0) {
      showToast('Your cart is empty. Please add items before firing order.', 'warning');
      return false;
    }

    let subtotal = 0;
    const orderItems = cartEntries.map(({ item, qty, notes }) => {
      subtotal += item.price * qty;
      return {
        name: item.name,
        qty,
        notes: notes || 'Standard serve'
      };
    });

    // Indian Restaurant GST standard is 5%
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const newOrder = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      tableNumber: activeTable.number,
      zone: activeTable.zone,
      status: 'new',
      elapsedMinutes: 0,
      items: orderItems,
      specialRequest: specialRequest + (splitBill ? ' [Split Bill Requested]' : ''),
      total: total,
      timestamp: 'Just now'
    };

    // Add to Live KDS orders list
    setOrders(prev => [newOrder, ...prev]);

    // Update table bill & status
    setTables(prev => prev.map(t => {
      if (t.number === activeTable.number) {
        return {
          ...t,
          status: 'occupied',
          bill: (t.bill || 0) + total,
          ordersCount: (t.ordersCount || 0) + 1
        };
      }
      return t;
    }));

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#89023e', '#ea638c', '#ffd9e0']
      });
    } catch (e) {
      // ignore
    }

    // Play New Order Buzzer locally
    if (soundEnabled) {
      playNewOrderBuzzer();
    }

    // Broadcast New Order Alert to Admin laptops, TV screens & Kitchen monitors
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('vb_restaurant_live_bus');
        channel.postMessage({
          type: 'NEW_ORDER_ALERT',
          order: newOrder,
          tableNumber: activeTable.number
        });
        channel.close();
      }
    } catch (e) {
      console.warn(e);
    }

    showToast(`Order #${newOrder.id} sent to Kitchen Line! Firing now.`, 'success', 'View KDS');
    return newOrder;
  };

  // KDS bump ticket to next stage
  const updateOrderStatus = (orderId, nextStatus) => {
    const targetOrder = orders.find(ord => ord.id === orderId);

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));

    // If marked ready by chef -> sound distinct Waiter / Runner buzzer
    if (nextStatus === 'ready') {
      if (soundEnabled) {
        playOrderReadyBuzzer();
      }
      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('vb_restaurant_live_bus');
          channel.postMessage({
            type: 'ORDER_READY_ALERT',
            orderId,
            tableNumber: targetOrder?.tableNumber || 'Unknown'
          });
          channel.close();
        }
      } catch (e) {}

      showToast(`Order #${orderId} (Table ${targetOrder?.tableNumber || ''}) is PLATED & READY! Waitstaff runner alerted.`, 'warning');
    } else {
      showToast(`Order ${orderId} moved to ${nextStatus}!`, 'info');
    }
  };

  // Table status toggle
  const updateTableStatus = (tableId, nextStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) return { ...t, status: nextStatus };
      return t;
    }));
  };

  // Call Server action
  const callWaiter = () => {
    if (soundEnabled) {
      playWaiterCallBuzzer();
    }

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('vb_restaurant_live_bus');
        channel.postMessage({
          type: 'CALL_WAITER_ALERT',
          tableNumber: activeTable.number
        });
        channel.close();
      }
    } catch (e) {}

    showToast(`Waiter notified for Table ${activeTable.number}. Staff will be with you shortly.`, 'info');
  };

  // Calculated totals in INR
  const cartEntries = Object.values(cart);
  const cartCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cartEntries.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = cartSubtotal + cartTax;

  return (
    <RestaurantContext.Provider value={{
      menuItems,
      toggleItemAvailability,
      addMenuItem,
      tables,
      updateTableStatus,
      orders,
      updateOrderStatus,
      activeTable,
      setActiveTable,
      cart,
      updateCartQty,
      addToCartWithOptions,
      submitOrder,
      callWaiter,
      cartCount,
      cartSubtotal,
      cartTax,
      cartTotal,
      formatINR,
      toast,
      showToast,
      emergencyHold,
      setEmergencyHold,
      adminAuth,
      loginAdmin,
      logoutAdmin,
      updateAdminProfile,
      soundEnabled,
      setSoundEnabled,
      playNewOrderBuzzer,
      playOrderReadyBuzzer,
      playWaiterCallBuzzer
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within RestaurantProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialMenuItems, initialTables, initialOrders } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  playNewOrderBuzzer, 
  playOrderReadyBuzzer, 
  playWaiterCallBuzzer 
} from '../utils/audioAlerts';
import { formatINR } from '../utils/currency';
import {
  getCustomerMenu,
  getAdminTables,
  getKdsOrders,
  submitOrderApi,
  updateTableStatusApi,
  bumpOrderStatusApi,
  toggleItemStockApi,
  createMenuItemApi,
  callServerApi,
  toggleEmergencyHoldApi
} from '../services/apiClient';
import {
  getSocket,
  joinTableRoom,
  joinKdsRoom,
  joinAdminRoom
} from '../services/socket';

const RestaurantContext = createContext(null);

export const RestaurantProvider = ({ children }) => {
  // Menu items (Synced between Backend, Admin & Customer with INR support)
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

  // System Notifications & Capacity Control
  const [toast, setToast] = useState(null);
  const [emergencyHold, setEmergencyHold] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

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

  const showToast = useCallback((message, type = 'info', action = null) => {
    setToast({ message, type, action });
    setTimeout(() => setToast(null), 4500);
  }, []);

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

  /* ==========================================================================
     1. INITIAL BACKEND DATA SYNC (REST API)
     ========================================================================== */
  useEffect(() => {
    let isMounted = true;

    const syncInitialData = async () => {
      try {
        // Fetch Menu from API
        const menuRes = await getCustomerMenu();
        if (isMounted && menuRes?.data?.data && Array.isArray(menuRes.data.data)) {
          setMenuItems(menuRes.data.data);
          setIsBackendConnected(true);
        }
      } catch (e) {
        // Silent fallback to cached/mock data
      }

      try {
        // Fetch Tables from API
        const tablesRes = await getAdminTables();
        if (isMounted && tablesRes?.data?.data && Array.isArray(tablesRes.data.data)) {
          setTables(tablesRes.data.data);
          setIsBackendConnected(true);
        }
      } catch (e) {}

      try {
        // Fetch KDS Orders from API
        const kdsRes = await getKdsOrders();
        if (isMounted && kdsRes?.data?.data) {
          const apiOrders = Array.isArray(kdsRes.data.data) 
            ? kdsRes.data.data 
            : Object.values(kdsRes.data.data).flat();
          if (apiOrders.length > 0) {
            setOrders(apiOrders);
            setIsBackendConnected(true);
          }
        }
      } catch (e) {}
    };

    syncInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================================================
     2. REAL-TIME SOCKET.IO GATEWAY & BROADCAST BUS
     ========================================================================== */
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    // Subscribe to Rooms
    joinKdsRoom();
    joinAdminRoom();
    if (activeTable?.number) {
      joinTableRoom(activeTable.number);
    }

    // 1. New Order Fired by customer
    const handleOrderCreated = ({ order }) => {
      if (!order) return;
      if (soundEnabled) {
        playNewOrderBuzzer();
      }
      setOrders(prev => {
        if (prev.some(o => o.id === order.id || o.orderNumber === order.orderNumber)) return prev;
        return [order, ...prev];
      });
      showToast(`🔔 New Order fired for Table ${order.tableNumber}!`, 'success', 'View KDS');
    };

    // 2. Ticket Status Bumped
    const handleStatusUpdated = ({ orderId, status, tableNumber }) => {
      if (status === 'ready' && soundEnabled) {
        playOrderReadyBuzzer();
      }
      setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, status } : o));
      if (status === 'ready') {
        showToast(`🍽️ Table ${tableNumber || ''} order is Plated & Ready! Waitstaff alerted.`, 'warning');
      }
    };

    // 3. 86'd Stock Toggled
    const handleStockToggled = ({ menuItemId, isAvailable, name }) => {
      setMenuItems(prev => prev.map(item => 
        (item.id === menuItemId || item._id === menuItemId) ? { ...item, isAvailable } : item
      ));
      showToast(`${name || 'Item'} is now ${isAvailable ? 'Restocked' : "Sold Out (86'd)"}!`, isAvailable ? 'success' : 'warning');
    };

    // 4. Waiter Call Alert
    const handleCallWaiter = ({ tableNumber, zone }) => {
      if (soundEnabled) {
        playWaiterCallBuzzer();
      }
      showToast(`🛎️ Table ${tableNumber} (${zone || 'Floor'}) requested assistance!`, 'info');
    };

    // 5. Emergency Hold Alert
    const handleHoldChanged = ({ emergencyHold: holdState }) => {
      setEmergencyHold(Boolean(holdState));
      if (holdState) {
        showToast('Kitchen line at peak capacity. Digital ordering paused.', 'error');
      } else {
        showToast('Kitchen line orders resumed.', 'success');
      }
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:status_updated', handleStatusUpdated);
    socket.on('menu:stock_toggled', handleStockToggled);
    socket.on('server:call_waiter', handleCallWaiter);
    socket.on('emergency_hold:changed', handleHoldChanged);

    // Cross-Tab Broadcast Channel (Local fallback)
    let channel = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('vb_restaurant_live_bus');
        channel.onmessage = (event) => {
          const { type, order, orderId, tableNumber } = event.data || {};
          if (type === 'NEW_ORDER_ALERT' && order) {
            handleOrderCreated({ order });
          } else if (type === 'ORDER_READY_ALERT') {
            handleStatusUpdated({ orderId, status: 'ready', tableNumber });
          } else if (type === 'CALL_WAITER_ALERT') {
            handleCallWaiter({ tableNumber });
          }
        };
      }
    } catch (e) {}

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:status_updated', handleStatusUpdated);
      socket.off('menu:stock_toggled', handleStockToggled);
      socket.off('server:call_waiter', handleCallWaiter);
      socket.off('emergency_hold:changed', handleHoldChanged);
      if (channel) {
        try { channel.close(); } catch (e) {}
      }
    };
  }, [activeTable, soundEnabled, showToast]);

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

  /* ==========================================================================
     3. USER ACTIONS (CONNECTED TO REST APIS + OPTIMISTIC UI)
     ========================================================================== */

  // Toggle dish 86'd out of stock
  const toggleItemAvailability = async (id) => {
    const currentItem = menuItems.find(m => m.id === id || m._id === id);
    const nextState = currentItem ? !currentItem.isAvailable : false;

    // Optimistic state update
    setMenuItems(prev => prev.map(item => {
      if (item.id === id || item._id === id) {
        return { ...item, isAvailable: nextState };
      }
      return item;
    }));

    showToast(
      nextState ? `Restocked "${currentItem?.name || 'Dish'}"!` : `86'd "${currentItem?.name || 'Dish'}" (Sold Out)`,
      nextState ? 'success' : 'warning'
    );

    // Call REST API
    try {
      await toggleItemStockApi(id, nextState);
    } catch (e) {}
  };

  // Add new dish from Admin Dish Builder
  const addMenuItem = async (newDish) => {
    const dish = {
      ...newDish,
      id: 'm_' + Date.now(),
      soldCount: 0,
      isAvailable: true
    };

    setMenuItems(prev => [dish, ...prev]);
    showToast(`Published "${dish.name}" to digital menus!`, 'success');

    // Call REST API
    try {
      await createMenuItemApi(dish);
    } catch (e) {}
  };

  // Cart operations
  const updateCartQty = (itemId, delta) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing && delta > 0) {
        const item = menuItems.find(m => m.id === itemId);
        if (!item) return prev;
        return {
          ...prev,
          [itemId]: { item, qty: 1, notes: '' }
        };
      }
      if (!existing) return prev;

      const nextQty = existing.qty + delta;
      if (nextQty <= 0) {
        const nextState = { ...prev };
        delete nextState[itemId];
        return nextState;
      }

      return {
        ...prev,
        [itemId]: { ...existing, qty: nextQty }
      };
    });
  };

  const addToCartWithOptions = (item, options = {}) => {
    setCart(prev => {
      const existing = prev[item.id] || { qty: 0 };
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
    showToast(`Added ${item.name} to Table ${activeTable.number} check!`, 'success');
  };

  // Submit order from Customer QR view
  const submitOrder = async (specialRequest = '', splitBill = false) => {
    if (emergencyHold) {
      showToast('Kitchen is currently at peak capacity. Digital orders temporarily paused.', 'error');
      return false;
    }

    const cartEntries = Object.values(cart);
    if (cartEntries.length === 0) {
      showToast('Your order slip is empty. Please add items before submitting.', 'warning');
      return false;
    }

    let subtotal = 0;
    const orderItems = cartEntries.map(({ item, qty, notes }) => {
      subtotal += item.price * qty;
      return {
        menuItemId: item.id || item._id,
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

    // Optimistic UI updates
    setOrders(prev => [newOrder, ...prev]);
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
    } catch (e) {}

    // Play New Order Buzzer locally
    if (soundEnabled) {
      playNewOrderBuzzer();
    }

    // Broadcast cross-window alert
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
    } catch (e) {}

    showToast(`Order #${newOrder.id} sent to Kitchen Line! Firing now.`, 'success', 'View KDS');

    // Call REST API in background
    try {
      await submitOrderApi({
        tableNumber: activeTable.number,
        zone: activeTable.zone,
        items: orderItems,
        specialRequest: newOrder.specialRequest,
        splitBill
      });
    } catch (e) {}

    return newOrder;
  };

  // KDS bump ticket to next stage
  const updateOrderStatus = async (orderId, nextStatus) => {
    const targetOrder = orders.find(ord => ord.id === orderId || ord.orderNumber === orderId);

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));

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

      showToast(`Order #${orderId} (Table ${targetOrder?.tableNumber || ''}) is Plated & Ready! Waitstaff runner alerted.`, 'warning');
    } else {
      showToast(`Order ${orderId} moved to ${nextStatus}!`, 'info');
    }

    // Call REST API
    try {
      await bumpOrderStatusApi(orderId, nextStatus);
    } catch (e) {}
  };

  // Table status toggle
  const updateTableStatus = async (tableId, nextStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId || t._id === tableId) return { ...t, status: nextStatus };
      return t;
    }));

    try {
      await updateTableStatusApi(tableId, nextStatus);
    } catch (e) {}
  };

  // Toggle Emergency Hold
  const toggleEmergencyHold = async (hold) => {
    setEmergencyHold(hold);
    showToast(hold ? 'Emergency hold activated: ordering paused' : 'Emergency hold lifted', hold ? 'error' : 'success');
    try {
      await toggleEmergencyHoldApi(hold);
    } catch (e) {}
  };

  // Call Server action
  const callWaiter = async () => {
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

    showToast(`Server notified for Table ${activeTable.number}. Staff will be with you shortly.`, 'info');

    try {
      await callServerApi(activeTable.number, activeTable.zone);
    } catch (e) {}
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
      setEmergencyHold: toggleEmergencyHold,
      adminAuth,
      loginAdmin,
      logoutAdmin,
      updateAdminProfile,
      soundEnabled,
      setSoundEnabled,
      playNewOrderBuzzer,
      playOrderReadyBuzzer,
      playWaiterCallBuzzer,
      isBackendConnected
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

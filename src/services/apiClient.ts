import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for clean error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful error logging
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('[API Client] Backend server unreachable at', API_BASE_URL, '- operating in offline demo mode.');
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   1. CUSTOMER QR ORDERING ENDPOINTS
   ========================================================================== */

/**
 * Fetch table status, zone, current bill, active orders & emergency hold state
 */
export const getTableDetails = (tableNumber: string) => 
  apiClient.get(`/customer/table/${tableNumber}`);

/**
 * Fetch digital menu (supports ?category=..., ?dietary=..., ?search=...)
 */
export const getCustomerMenu = (params?: { category?: string; dietary?: string; search?: string }) => 
  apiClient.get('/customer/menu', { params });

/**
 * Place a new customer order (auto-calculates 5% GST, returns order number & prep ETA)
 */
export const submitOrderApi = (orderPayload: {
  tableNumber: string;
  zone: string;
  items: Array<{
    menuItemId?: string;
    name: string;
    qty: number;
    notes?: string;
    customization?: any;
  }>;
  specialRequest?: string;
  splitBill?: boolean;
}) => apiClient.post('/customer/orders', orderPayload);

/**
 * Page waiter for assistance at a table
 */
export const callServerApi = (tableNumber: string, zone: string) => 
  apiClient.post('/customer/call-server', { tableNumber, zone });

/* ==========================================================================
   2. ADMIN TABLE & FLOOR PLAN ENDPOINTS
   ========================================================================== */

/**
 * Fetch all 24 tables with floor occupancy metrics
 */
export const getAdminTables = (params?: { zone?: string; status?: string }) => 
  apiClient.get('/admin/tables', { params });

/**
 * Update table state (available, occupied, reserved, cleaning)
 */
export const updateTableStatusApi = (tableId: string, status: string) => 
  apiClient.patch(`/admin/tables/${tableId}/status`, { status });

/**
 * Toggle emergency hold on digital ordering
 */
export const toggleEmergencyHoldApi = (hold: boolean) => 
  apiClient.post('/admin/emergency-hold', { hold });

/* ==========================================================================
   3. KITCHEN DISPLAY SYSTEM (KDS) ENDPOINTS
   ========================================================================== */

/**
 * Fetch grouped Kanban tickets (new, inPrep, ready, served)
 */
export const getKdsOrders = () => 
  apiClient.get('/admin/kds/orders');

/**
 * Advance ticket status (in-prep, ready, served)
 */
export const bumpOrderStatusApi = (orderId: string, status: string) => 
  apiClient.patch(`/admin/kds/orders/${orderId}/bump`, { status });

/* ==========================================================================
   4. MENU & CATALOG MANAGEMENT ENDPOINTS
   ========================================================================== */

/**
 * Fetch complete catalog with food cost margins and sold counts
 */
export const getAdminMenu = (params?: { category?: string; search?: string }) => 
  apiClient.get('/admin/menu', { params });

/**
 * Instant 86'd stock toggle
 */
export const toggleItemStockApi = (itemId: string, isAvailable: boolean) => 
  apiClient.patch(`/admin/menu/${itemId}/toggle-stock`, { isAvailable });

/**
 * Publish new dish to live QR menus
 */
export const createMenuItemApi = (dishData: any) => 
  apiClient.post('/admin/menu', dishData);

/* ==========================================================================
   5. ANALYTICS & REPORTING ENDPOINTS
   ========================================================================== */

/**
 * Revenue, ticket size, table turn time
 */
export const getAnalyticsOverview = () => 
  apiClient.get('/admin/analytics/overview');

/**
 * Hourly order distribution and peak hour
 */
export const getPeakHours = () => 
  apiClient.get('/admin/analytics/peak-hours');

/**
 * Revenue breakdown across food & cocktail categories
 */
export const getCategorySplit = () => 
  apiClient.get('/admin/analytics/category-split');

/**
 * Top 5 dishes with margins and units sold
 */
export const getTopSellers = () => 
  apiClient.get('/admin/analytics/top-sellers');


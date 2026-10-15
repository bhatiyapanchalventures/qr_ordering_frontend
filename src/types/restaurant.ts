export interface MenuItem {
  id: string;
  _id?: string;
  name: string;
  category: string;
  price: number;
  prepTime?: number;
  prepTimeMinutes?: number;
  dietary?: string;
  dietaryTags?: string[];
  isSignature?: boolean;
  isAvailable: boolean;
  description: string;
  image: string;
  soldCount?: number;
  marginPercent?: number;
}

export interface Table {
  id: string;
  _id?: string;
  number: string;
  zone: string;
  zoneGroup?: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  bill?: number;
  currentBill?: number;
  ordersCount?: number;
  server?: string;
  assignedServer?: string;
  qrToken?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price?: number;
  unitPrice?: number;
  notes?: string;
  customization?: {
    temperature?: string;
    side?: string;
  };
}

export interface Order {
  id: string;
  _id?: string;
  orderNumber?: string;
  tableNumber: string;
  zone: string;
  status: 'new' | 'in-prep' | 'ready' | 'served' | 'cancelled';
  elapsedMinutes: number;
  items: OrderItem[];
  specialRequest?: string;
  subtotal?: number;
  taxGST?: number;
  total: number;
  splitBill?: boolean;
  splitBillRequested?: boolean;
  timestamp?: string;
  createdAt?: string;
}

export interface AnalyticsOverview {
  grossDailyRevenue: number;
  ordersCount: number;
  ordersChangeVsLunch: number;
  averageTicketSize: number;
  averageTableTurnMinutes: number;
}

export interface PeakHourData {
  hour: string;
  orders: number;
  height?: string;
  peak?: boolean;
}

export interface CategorySplitData {
  category: string;
  percentage: number;
  revenue: number;
}

export interface TopSellerData {
  name: string;
  category: string;
  sold: number;
  revenue: number | string;
  rev?: string;
  marginPercent?: number;
  margin?: string;
}

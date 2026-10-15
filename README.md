# Velvet Bloom Bistro • React Vite QR Ordering & Aura POS Suite

A modern, responsive restaurant QR ordering & management web app built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Lucide Icons**.

Repository: `https://github.com/bhatiyapanchalventures/qr_ordering_frontend.git`

---

## 🌟 Key Features

### 1. 📱 Customer-Facing QR Dine-In Ordering
- **Table Detection**: Automatically maps to tables (e.g. Table 04, Table 12) via URL parameters or in-app simulated QR scanner.
- **Digital Listed Menu**: Chef Specials, Small Plates, Mains & Grills, Cocktails, Desserts.
- **Currency & Tax**: All prices in Indian Rupees (**₹ - INR**) with automated 5% Restaurant GST calculation.
- **Dietary Filter Chips**: One-click filtering for Vegetarian, Gluten-Free, Signature, and Spicy.
- **Interactive Modifiers**: In-card customization for meat temperature (Medium Rare, Medium, Well Done) and side choices.
- **Dual Responsive Layout**:
  - **Smartphones**: Floating bottom bar with pinging badge, subtotal, and pull-up review sheet.
  - **Laptops / Tablets / Desktops**: Seamless layout with a persistent live checkout sidebar.
- **Instant Dispatch & Chimes**: Dispatches tickets directly to the live kitchen KDS with acoustic kitchen buzzer ring, celebratory confetti, and live toast alerts.

### 2. 🔐 Executive Admin Authentication & Terminal Profile
- **Manager Credentials**:
  - **Phone / Manager ID**: `9586784989` (Permanently locked security ID)
  - **Access PIN / Password**: `600300`
- **Default Landing**: Logging in automatically directs to the **Analytics Dashboard** first.
- **Standalone Profile Page (`AdminProfile.jsx`)**:
  - Edit Manager Name and Gmail address.
  - View verified Restaurant Entity details (GSTIN, FSSAI License, Outlet address).
  - Test and configure Web Audio acoustic buzzers.
  - Standalone lock button in top navbar to secure the terminal.

### 3. 🔔 Multi-Device Live Alert Buzzers (Web Audio API)
- **Zero MP3 Latency**: Synthesized via browser Web Audio API for 100% reliable acoustic rings on iOS, Android, and Desktop.
- **Kitchen Order Influx Buzzer**: Crisp 3-tone high-frequency POS bell alert (`ding-ding-ding`) when a customer submits an order.
- **Waiter / Runner Pickup Bell**: Warm 2-tone harmonic dual-bell (`ding-dong`) when chef marks an order as plated & ready.
- **Cross-Window Sync**: Native `BroadcastChannel` synchronization rings laptop speakers and kitchen TV monitors when customers order from their phones.

### 4. 👨‍🍳 Kitchen Display System (KDS) & Wall TV Display
- **4-Column Kanban Pipeline**: Incoming / New &rarr; In Kitchen / Firing &rarr; Plated / Ready to Serve &rarr; Completed / Served.
- **Dedicated Kitchen TV Mode**: High-contrast dark theme (`bg-slate-950`), extra-large bold table numbers, and high-visibility quantities visible across a busy line.
- **Mobile Stage Filter**: Instant station switcher (`All`, `Incoming`, `In Kitchen`, `Ready`, `History`) for mobile cooks.
- **Elapsed Cook Timers**: Dynamic elapsed minutes with color-coded urgency alerts.

### 5. 📍 Table & Floor QR Management
- **Table Overview**: Visual grid of 24 tables across 3 dining zones (*Indoor Dining*, *Patio & Garden*, *Rooftop Bar*).
- **Occupancy & Live Checks**: Real-time table status (Occupied, Available, Reserved, Cleaning), active bill totals, and assigned server.
- **Tabletop QR Plaques**: Vector printable QR stand preview with NFC instruction.
- **Direct Test Launch**: 1-click button to bind session and launch the customer menu for that table.
- **Emergency Hold**: One-click freeze to halt incoming digital orders if the kitchen line is at peak capacity.

### 6. 📋 Menu & Catalog Management (Restaurant Management Team)
- **Live 86'd Out of Stock Toggle**: Instantly mark dishes as sold out; immediately updates and disables ordering on the customer view.
- **Dish Builder Modal**: Add new culinary items with courses, prices in ₹, allergen tags, prep times, and photography URLs.
- **Profit Margins**: Real-time food cost and margin indicators per dish.

### 7. 📈 Order Analytics & Revenue Dashboard
- **Key Performance Indicators**: Gross daily revenue (`₹1,84,250`), completed order volume (`184`), average ticket size (`₹1,250`), and table turnover duration (`42 min`).
- **Peak Hours Dining Traffic**: Bar chart distribution of order volume per service hour.
- **Category Sales Split**: Percentage distribution across Mains, Cocktails, Small Plates, and Desserts.
- **Bestseller Matrix**: Top dishes ranked by volume and profit margin.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (with `@theme` design tokens)
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Synthesizer
- **State & Sync**: React Context + Browser `BroadcastChannel`
- **Fx**: Canvas Confetti

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/bhatiyapanchalventures/qr_ordering_frontend.git
cd qr_ordering_frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev

# Build for Production
npm run build
```

---

## 📑 Backend API Specification

A complete backend specification for Node.js, Express, TypeScript, and MongoDB Atlas is included in [BACKEND_API_SPECIFICATION.md](./BACKEND_API_SPECIFICATION.md).

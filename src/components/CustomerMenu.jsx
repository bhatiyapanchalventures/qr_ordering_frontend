import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Utensils, 
  Search, 
  Sparkles, 
  Clock, 
  Flame, 
  Leaf, 
  Wheat, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  QrCode, 
  X, 
  Microwave, 
  BellRing,
  HelpCircle,
  SplitSquareVertical,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

export const CustomerMenu = ({ onNavigateToKDS }) => {
  const { 
    menuItems, 
    activeTable, 
    setActiveTable, 
    tables, 
    cart, 
    updateCartQty, 
    addToCartWithOptions, 
    submitOrder, 
    callWaiter, 
    cartCount, 
    cartSubtotal, 
    cartTax, 
    cartTotal,
    formatINR 
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');
  const [splitBill, setSplitBill] = useState(false);

  // Customizer modal for complex dishes
  const [customizingDish, setCustomizingDish] = useState(null);
  const [customTemp, setCustomTemp] = useState('Medium Rare');
  const [customSide, setCustomSide] = useState('Truffle Puree');

  const categories = ['All', 'Chef Specials', 'Small Plates', 'Mains & Grills', 'Artisanal Cocktails', 'Desserts'];

  // Filtered menu items
  const filteredDishes = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'All' || 
      (selectedDietary === 'Vegetarian' && item.dietary?.includes('Vegetarian')) ||
      (selectedDietary === 'Gluten-Free' && item.dietary?.includes('Gluten-Free')) ||
      (selectedDietary === 'Signature' && (item.isSignature || item.dietary?.includes('Signature'))) ||
      (selectedDietary === 'Spicy' && item.dietary?.includes('Spicy'));
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  const handleOrderSubmit = () => {
    const newOrder = submitOrder(specialRequest, splitBill);
    if (newOrder) {
      setIsSheetOpen(false);
      setSpecialRequest('');
    }
  };

  const openCustomizer = (dish) => {
    setCustomizingDish(dish);
    setCustomTemp('Medium Rare');
    setCustomSide('Truffle Puree');
  };

  const handleAddCustomized = () => {
    if (!customizingDish) return;
    addToCartWithOptions(customizingDish, {
      temp: customTemp,
      side: customSide,
      notes: `${customTemp}, ${customSide}`
    });
    setCustomizingDish(null);
  };

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8 2xl:p-10 space-y-6">

      {/* DEDICATED DINING SUB-HEADER (Clean, seamless across all screens) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold font-headline text-slate-900 tracking-tight flex items-center gap-2">
              <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-[#89023e]" />
              <span>Digital QR Dine-in Menu</span>
            </h1>
            
            {/* Active Table Pill */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs 2xl:text-sm font-bold text-[#89023e] hover:bg-pink-100 transition-colors shadow-2xs"
              title="Tap to switch table QR simulation"
            >
              <span className="w-2 h-2 rounded-full bg-[#ea638c] animate-pulse"></span>
              <span>Table {activeTable.number} &bull; {activeTable.zone}</span>
              <QrCode className="w-3.5 h-3.5 ml-1 opacity-75" />
            </button>
          </div>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 mt-1">
            Tap dishes to add to your table check. Orders dispatch in real-time to the chef's pass with 5% GST included.
          </p>
        </div>

        {/* Right Actions: Call Server & Split Bill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button 
            onClick={callWaiter}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-[#89023e] text-xs 2xl:text-sm font-semibold active:scale-95 transition-all shadow-2xs"
          >
            <BellRing className="w-4 h-4 text-[#89023e]" />
            <span>Call Server</span>
          </button>

          <button
            onClick={() => setSplitBill(!splitBill)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs 2xl:text-sm font-semibold transition-all shadow-2xs ${
              splitBill
                ? 'bg-[#89023e] text-white border-[#89023e]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4" />
            <span>{splitBill ? 'Split Bill ON' : 'Split Bill'}</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 2xl:gap-8 items-start">

        {/* LEFT 8 COLUMNS: MENU CATALOG */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">

          {/* WELCOMING HERO BANNER */}
          <section className="relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/90 via-white to-pink-50/50 p-5 sm:p-6 2xl:p-8 shadow-xs">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] 2xl:text-xs font-bold text-[#89023e] uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chef's Curated Service &bull; Velvet Bloom
                </span>
                <span className="flex items-center gap-1 text-xs 2xl:text-sm text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#89023e]" /> Last orders in 45m
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-headline font-bold text-slate-900 mt-2">
                Artisanal Botany &amp; <span className="text-[#89023e]">Earthy Flavors</span>
              </h2>
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Browse our seasonal dishes below, configure special dietary requirements, or pair with botanical highballs. Orders dispatch directly to Chef line for Table {activeTable.number}.
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-[#ea638c]/15 blur-2xl pointer-events-none"></div>
          </section>

          {/* SEARCH & DIETARY FILTER CHIPS */}
          <section className="space-y-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Wagyu, Gyoza, Cocktails, Desserts..."
                className="w-full pl-10 pr-10 py-2.5 2xl:py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm 2xl:text-base placeholder:text-slate-400 focus:bg-white focus:border-[#89023e] focus:ring-1 focus:ring-[#89023e] outline-none transition-all shadow-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary Tags */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
              {[
                { label: 'All', icon: null },
                { label: 'Signature', icon: Sparkles, color: 'text-amber-500' },
                { label: 'Vegetarian', icon: Leaf, color: 'text-emerald-600' },
                { label: 'Gluten-Free', icon: Wheat, color: 'text-amber-600' },
                { label: 'Spicy', icon: Flame, color: 'text-rose-500' }
              ].map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => setSelectedDietary(label)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs 2xl:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                    selectedDietary === label 
                      ? 'bg-[#89023e] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${selectedDietary === label ? 'text-white' : color}`} />}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* HORIZONTAL CATEGORY TABS */}
          <section className="space-y-2">
            <div className="flex items-center justify-between text-xs 2xl:text-sm text-slate-500 font-semibold">
              <span className="uppercase tracking-wider">Browse Course</span>
              <span>{filteredDishes.length} dishes</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs 2xl:text-sm font-semibold transition-all whitespace-nowrap shadow-xs ${
                    selectedCategory === cat
                      ? 'bg-[#89023e] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-pink-300 hover:text-[#89023e]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* DISHES GRID (Responsive: 1 col on mobile, 2 on tablet, 2-3 on laptop/2xl) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 2xl:gap-5">
            {filteredDishes.map(dish => {
              const cartQty = cart[dish.id]?.qty || 0;

              return (
                <article 
                  key={dish.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    !dish.isAvailable 
                      ? 'border-amber-200 opacity-75 bg-slate-50/50' 
                      : 'border-slate-200 hover:border-pink-300'
                  }`}
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                          !dish.isAvailable ? 'grayscale-[40%]' : ''
                        }`}
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {dish.isSignature && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#89023e] text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" /> Signature
                          </span>
                        )}
                        {dish.dietary && (
                          <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-xs">
                            {dish.dietary}
                          </span>
                        )}
                      </div>

                      {/* Sold Out badge */}
                      {!dish.isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow-md">
                            Sold Out (86'd)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dish Metadata */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-headline font-bold text-base 2xl:text-lg text-slate-900 leading-snug">
                          {dish.name}
                        </h3>
                        <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium shrink-0">
                          ~{dish.prepTime}m
                        </span>
                      </div>
                      <p className="text-xs 2xl:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Price in INR & Add / Quantity Stepper */}
                  <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                    <span className="font-headline font-bold text-base 2xl:text-lg text-[#89023e]">
                      {formatINR(dish.price)}
                    </span>

                    {dish.isAvailable ? (
                      cartQty > 0 ? (
                        <div className="flex items-center gap-2 bg-[#fdf2f4] rounded-full px-2 py-1 border border-[#fbcfe8]">
                          <button 
                            onClick={() => updateCartQty(dish.id, -1)}
                            className="w-6 h-6 rounded-full bg-white text-[#89023e] flex items-center justify-center hover:bg-rose-50 transition-colors shadow-2xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs text-[#89023e] min-w-[16px] text-center">
                            {cartQty}
                          </span>
                          <button 
                            onClick={() => updateCartQty(dish.id, 1)}
                            className="w-6 h-6 rounded-full bg-[#89023e] text-white flex items-center justify-center hover:bg-[#a0034a] transition-colors shadow-2xs font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateCartQty(dish.id, 1)}
                          className="px-4 py-1.5 rounded-full bg-[#fdf2f4] hover:bg-[#89023e] hover:text-white border border-[#fbcfe8] text-[#89023e] text-xs 2xl:text-sm font-semibold transition-all active:scale-95 flex items-center gap-1 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      )
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 italic">Unavailable</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Dietary / Allergy Note */}
          <section className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 flex items-start gap-3 shadow-2xs">
            <HelpCircle className="w-5 h-5 text-[#89023e] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs 2xl:text-sm font-bold text-[#89023e]">Food Allergies or Custom Preparations?</h4>
              <p className="text-xs 2xl:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Add special preparation notes before submitting your order. Every ticket is printed and verified at the Chef's station prior to firing.
              </p>
            </div>
          </section>

        </div>


        {/* RIGHT 4 COLUMNS: DESKTOP PERSISTENT ORDER CHECKOUT PANEL (Laptop / Desktop POS Style) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 2xl:p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center text-[#89023e]">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm 2xl:text-base text-slate-900">Table {activeTable.number} Check</h3>
                  <span className="text-xs text-slate-500">{activeTable.zone}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#89023e] text-xs font-bold">
                {cartCount} items
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 max-h-64 2xl:max-h-80 overflow-y-auto pr-1">
              {Object.entries(cart).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 italic">
                  Your order slip is empty. Tap "Add" on any dish to begin.
                </div>
              ) : (
                Object.entries(cart).map(([itemId, { item, qty, notes }]) => (
                  <div key={itemId} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs 2xl:text-sm">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#89023e]">{qty}x</span>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      {notes && <span className="text-[11px] text-slate-400 pl-4 block">{notes}</span>}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold font-mono text-slate-900">{formatINR(item.price * qty)}</span>
                      <button 
                        onClick={() => updateCartQty(itemId, -qty)} 
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="text-[11px] 2xl:text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>Kitchen Instructions &bull; Dietary Preferences</span>
              </label>
              <textarea 
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Less salt, extra lime, serve dessert last..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#89023e] outline-none"
              />
            </div>

            {/* Billing Breakdown with 5% GST */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs 2xl:text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-slate-800 font-mono">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>5% Restaurant GST</span>
                <span className="font-semibold text-slate-800 font-mono">{formatINR(cartTax)}</span>
              </div>
              <div className="flex justify-between text-sm 2xl:text-base font-bold pt-2 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-[#89023e] font-mono text-lg">{formatINR(cartTotal)}</span>
              </div>
            </div>

            {/* Submit to Kitchen Button */}
            <button
              onClick={handleOrderSubmit}
              disabled={cartCount === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#89023e] to-[#a0034a] hover:from-[#a0034a] hover:to-[#bd0357] disabled:opacity-50 text-white font-bold text-xs 2xl:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20 active:scale-98 transition-all"
            >
              <Microwave className="w-4 h-4" />
              <span>Send Order to Kitchen &bull; Table {activeTable.number}</span>
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE STICKY BOTTOM BAR (Visible only on mobile screens < 1024px) */}
      <aside className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-500">Table {activeTable.number} Check</span>
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {formatINR(cartTotal)} <span className="text-[10px] text-slate-400 font-normal">({cartCount} items)</span>
            </div>
          </div>

          <button
            onClick={() => setIsSheetOpen(true)}
            disabled={cartCount === 0}
            className="px-5 py-2.5 rounded-full bg-[#89023e] hover:bg-[#a0034a] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Review Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE ORDER REVIEW BOTTOM SHEET */}
      <div 
        className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSheetOpen(false)}
      />
      <section 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out border-t border-rose-100 flex flex-col max-h-[85vh] lg:hidden ${
          isSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-1 cursor-pointer" onClick={() => setIsSheetOpen(false)}></div>
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Review Table {activeTable.number} Order</h3>
            <span className="text-[11px] text-slate-500">{activeTable.zone}</span>
          </div>
          <button onClick={() => setIsSheetOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Cart Items */}
          <div className="space-y-2 border-b border-slate-100 pb-3">
            {Object.entries(cart).map(([itemId, { item, qty, notes }]) => (
              <div key={itemId} className="flex items-center justify-between py-1.5">
                <div>
                  <span className="font-bold text-[#89023e]">{qty}x</span>
                  <span className="font-semibold text-slate-800 ml-1.5">{item.name}</span>
                  {notes && <span className="text-[11px] text-slate-400 block pl-5">{notes}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-slate-900">{formatINR(item.price * qty)}</span>
                  <button onClick={() => updateCartQty(itemId, -qty)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kitchen Instructions</label>
            <textarea 
              rows={2} 
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#89023e] outline-none" 
              placeholder="Allergies, preferences..." 
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal ({cartCount} items)</span>
              <span className="font-semibold text-slate-800 font-mono">{formatINR(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>5% GST</span>
              <span className="font-semibold text-slate-800 font-mono">{formatINR(cartTax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
              <span>Total Due</span>
              <span className="text-[#89023e] font-mono text-base">{formatINR(cartTotal)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={handleOrderSubmit}
            disabled={cartCount === 0}
            className="w-full h-11 rounded-xl bg-[#89023e] hover:bg-[#a0034a] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
          >
            <Microwave className="w-4 h-4" />
            <span>Send Order to Kitchen &bull; Table {activeTable.number}</span>
          </button>
        </div>
      </section>

      {/* QR SCANNER SIMULATION MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#89023e] font-bold text-sm">
                <QrCode className="w-4 h-4" />
                <span>Select Dine-in Table</span>
              </div>
              <button onClick={() => setIsQrModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR camera target animation */}
            <div className="my-5 relative w-44 h-44 mx-auto bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-rose-300 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-transparent to-rose-500/20 animate-pulse"></div>
              <QrCode className="w-16 h-16 text-rose-300 opacity-60" />
              <div className="absolute w-full h-0.5 bg-rose-500 top-0 animate-bounce"></div>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Select a table to begin ordering:
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4 max-h-40 overflow-y-auto pr-1">
              {tables.map(tbl => (
                <button
                  key={tbl.id}
                  onClick={() => {
                    setActiveTable({ number: tbl.number, zone: tbl.zone });
                    setIsQrModalOpen(false);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    activeTable.number === tbl.number
                      ? 'bg-[#89023e] text-white border-[#89023e]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-pink-50'
                  }`}
                >
                  T-{tbl.number}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

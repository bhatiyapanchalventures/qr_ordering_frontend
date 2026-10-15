import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Plus, 
  Search, 
  Utensils, 
  Sparkles, 
  X, 
  Edit3, 
  Clock, 
  ExternalLink, 
  FileDown, 
  Ban, 
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminMenuManagement = ({ onLaunchCustomerView }) => {
  const { menuItems, toggleItemAvailability, addMenuItem, formatINR, showToast } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Dish Form State
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState('Chef Specials');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrepTime, setNewDishPrepTime] = useState('12');
  const [newDishDietary, setNewDishDietary] = useState('Gluten-Free');
  const [newDishImage, setNewDishImage] = useState('');
  const [newDishSignature, setNewDishSignature] = useState(false);

  const categories = ['All', 'Chef Specials', 'Small Plates', 'Mains & Grills', 'Artisanal Cocktails', 'Desserts'];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveNewDish = (e) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice) {
      showToast('Please enter both dish name and price', 'warning');
      return;
    }

    addMenuItem({
      name: newDishName,
      category: newDishCategory,
      price: parseFloat(newDishPrice),
      description: newDishDesc || 'Curated seasonal ingredients prepared by our culinary team.',
      prepTime: parseInt(newDishPrepTime) || 10,
      dietary: newDishDietary,
      isSignature: newDishSignature,
      image: newDishImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
    });

    setIsAddModalOpen(false);
    // Reset
    setNewDishName('');
    setNewDishPrice('');
    setNewDishDesc('');
    setNewDishImage('');
  };

  const soldOutCount = menuItems.filter(m => !m.isAvailable).length;

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8 2xl:p-10 space-y-5 sm:space-y-6">

      {/* SUB-HEADER / ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 tracking-tight">
              Menu &amp; Dish Catalog Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-pink-50 text-[#89023e] border border-pink-200 font-semibold">
              {menuItems.length} Live Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Managed by restaurant management team &bull; Real-time sync with customer table QR menus.
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={onLaunchCustomerView}
            className="px-3.5 py-2 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-[#89023e] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Customer View</span>
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#89023e] hover:bg-[#720033] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* METRIC ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Menu Items</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-slate-900">{menuItems.length}</span>
              <span className="text-xs text-[#89023e] font-semibold">5 Courses</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Live on Table QRs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#89023e]">
            <Utensils className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#89023e]"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">Chef Specials</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-[#89023e]">
                {menuItems.filter(m => m.category === 'Chef Specials').length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-[#89023e] border border-pink-200 font-semibold">
                Promoted
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Top of customer screen</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#89023e]">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">86'd (Sold Out)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-amber-600">{soldOutCount}</span>
              <span className="text-xs text-amber-700 font-medium">Out of Stock</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Disabled on Table QRs</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Ban className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">Average Dish Margin</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-emerald-600">74.2%</span>
              <span className="text-xs text-emerald-600 font-semibold">+3.4% YoY</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Food cost optimized</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CATEGORY & SEARCH BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat
                  ? 'bg-[#89023e] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative text-xs w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            placeholder="Search dish or ingredient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#89023e]"
          />
        </div>
      </div>

      {/* DISHES CATALOG GRID (Responsive: 1 on mobile, 2 on tablet, 3 on laptop, 4 on 2xl/TV) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredItems.map(dish => (
          <div 
            key={dish.id}
            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
              !dish.isAvailable ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200 hover:border-pink-300'
            }`}
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className={`w-full h-full object-cover ${!dish.isAvailable ? 'grayscale-[30%]' : ''}`}
                />
                
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {dish.isSignature && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#89023e] text-white text-[11px] font-bold shadow-xs">
                      Signature
                    </span>
                  )}
                  {dish.dietary && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 text-[11px] font-medium border border-slate-200 shadow-xs">
                      {dish.dietary}
                    </span>
                  )}
                </div>

                {/* Stock status indicator */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs flex items-center gap-1 ${
                    dish.isAvailable 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dish.isAvailable ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    {dish.isAvailable ? 'In Stock' : "86'd / Out"}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 font-headline text-[#89023e] text-sm font-bold shadow-xs">
                  {formatINR(dish.price)}
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-headline font-bold text-base text-slate-900">{dish.name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">~{dish.prepTime}m prep</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{dish.description}</p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                    {dish.category}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Sold: {dish.soldCount || 0} this week
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Stock Toggle Controls */}
            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={dish.isAvailable}
                  onChange={() => toggleItemAvailability(dish.id)}
                  className="rounded text-[#89023e] focus:ring-[#89023e] cursor-pointer"
                />
                <span>{dish.isAvailable ? 'Available on QRs' : "86'd Out of Stock"}</span>
              </label>

              <button
                onClick={() => toggleItemAvailability(dish.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  dish.isAvailable
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {dish.isAvailable ? "Mark 86'd" : 'Restock'}
              </button>
            </div>
          </div>
        ))}

        {/* Add New Dish Placeholder Card */}
        <div 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-pink-50/40 hover:bg-pink-50 border-2 border-dashed border-pink-300 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all hover:scale-[1.01]"
        >
          <div className="w-12 h-12 rounded-full bg-white border border-pink-200 flex items-center justify-center text-[#89023e] shadow-xs mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="font-headline font-bold text-slate-900 text-sm">Add New Menu Item</h4>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Configure photo, course, preparation time, and allergen flags.
          </p>
          <span className="mt-4 px-4 py-1.5 rounded-xl bg-[#89023e] text-white text-xs font-bold shadow-xs">
            Open Dish Builder
          </span>
        </div>
      </div>

      {/* ADD DISH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleSaveNewDish}
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-headline font-bold text-base text-slate-900">Add Dish to Digital Menu</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Dish Name *</label>
                <input 
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Hokkaido Scallop Ceviche"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course Category</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                  >
                    <option>Chef Specials</option>
                    <option>Small Plates</option>
                    <option>Mains &amp; Grills</option>
                    <option>Artisanal Cocktails</option>
                    <option>Desserts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹ INR) *</label>
                  <input 
                    type="number"
                    step="10"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="1250"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Culinary Description</label>
                <textarea 
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Describe aromatics, cooking technique, and accompaniments..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prep Time (Mins)</label>
                  <input 
                    type="number"
                    value={newDishPrepTime}
                    onChange={(e) => setNewDishPrepTime(e.target.value)}
                    placeholder="12"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dietary Tag</label>
                  <select
                    value={newDishDietary}
                    onChange={(e) => setNewDishDietary(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                  >
                    <option>Gluten-Free</option>
                    <option>Vegetarian</option>
                    <option>Signature</option>
                    <option>Spicy</option>
                    <option>None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL (Optional)</label>
                <input 
                  type="text"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#89023e] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="sigCheckbox"
                  checked={newDishSignature}
                  onChange={(e) => setNewDishSignature(e.target.checked)}
                  className="rounded text-[#89023e] focus:ring-[#89023e] cursor-pointer"
                />
                <label htmlFor="sigCheckbox" className="font-semibold text-slate-700 cursor-pointer">
                  Mark as Chef Signature (Featured Badge)
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#89023e] hover:bg-[#720033] text-white text-xs font-bold transition-all shadow-sm"
              >
                Publish to QR Menus
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};


import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Users, 
  Calendar, 
  ArrowUpRight,
  Sparkles,
  BarChart3,
  BadgePercent,
  Download,
  Filter
} from 'lucide-react';

export const AdminAnalytics = () => {
  const { menuItems, orders, formatINR, showToast } = useRestaurant();

  const peakHoursData = [
    { hour: '12 PM', orders: 18, height: '40%' },
    { hour: '1 PM', orders: 32, height: '70%' },
    { hour: '2 PM', orders: 24, height: '52%' },
    { hour: '5 PM', orders: 15, height: '35%' },
    { hour: '6 PM', orders: 38, height: '82%' },
    { hour: '7 PM', orders: 48, height: '100%', peak: true },
    { hour: '8 PM', orders: 42, height: '90%' },
    { hour: '9 PM', orders: 28, height: '60%' },
    { hour: '10 PM', orders: 14, height: '30%' }
  ];

  const topSellers = [
    { name: 'Sakura A5 Wagyu Tataki', category: 'Chef Specials', sold: 142, rev: '₹2,62,700', margin: '71%' },
    { name: 'Kyoto Sakura Smoked Highball', category: 'Cocktails', sold: 210, rev: '₹1,57,500', margin: '82%' },
    { name: 'Duck Magret & Hibiscus Glaze', category: 'Mains & Grills', sold: 98, rev: '₹1,42,100', margin: '73%' },
    { name: 'Black Truffle & Wild Mushroom Gyoza', category: 'Small Plates', sold: 185, rev: '₹1,20,250', margin: '78%' },
    { name: 'Matcha & Ruby Blossom Lava Cake', category: 'Desserts', sold: 84, rev: '₹46,200', margin: '80%' }
  ];

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8 2xl:p-10 space-y-5 sm:space-y-6">

      {/* SUB-HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <h1 className="text-xl sm:text-2xl 2xl:text-3xl font-bold font-headline text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-[#89023e]" />
              <span>Order Analytics &amp; Revenue Dashboard</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
              Real-time Sync &bull; INR (₹)
            </span>
          </div>
          <p className="text-xs sm:text-sm 2xl:text-base text-slate-500 mt-1">
            Performance metrics across Table QR digital checks, server turns, and popular dishes with 5% GST.
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs 2xl:text-sm font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-[#89023e]" />
            <span>Today &bull; Dinner Service</span>
          </div>
          <button 
            onClick={() => showToast('Financial ledger & CSV report exported for today!', 'success')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs 2xl:text-sm font-semibold text-slate-700 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* 4 KPI METRICS (Responsive: 1 col on XS, 2 col on SM/MD, 4 col on LG, larger on 2XL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 2xl:gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-4 sm:p-5 2xl:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#89023e]"></div>
          <div>
            <span className="text-xs 2xl:text-sm font-medium text-slate-500">Gross Daily Revenue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl 2xl:text-4xl font-headline font-bold text-slate-900">₹1,84,250</span>
            </div>
            <span className="text-[11px] 2xl:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% vs last week
            </span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#89023e] font-bold text-xl 2xl:text-2xl shrink-0">
            ₹
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 sm:p-5 2xl:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500"></div>
          <div>
            <span className="text-xs 2xl:text-sm font-medium text-slate-500">Completed Orders</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl 2xl:text-4xl font-headline font-bold text-slate-900">184</span>
            </div>
            <span className="text-[11px] 2xl:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +22 orders vs lunch
            </span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 sm:p-5 2xl:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div>
            <span className="text-xs 2xl:text-sm font-medium text-slate-500">Average Ticket Size</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl 2xl:text-4xl font-headline font-bold text-slate-900">₹1,250</span>
            </div>
            <span className="text-[11px] 2xl:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +₹180 via QR add-ons
            </span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 sm:p-5 2xl:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <div>
            <span className="text-xs 2xl:text-sm font-medium text-slate-500">Average Table Turn</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl 2xl:text-4xl font-headline font-bold text-slate-900">42 min</span>
            </div>
            <span className="text-[11px] 2xl:text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> -12m faster via QR
            </span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7" />
          </div>
        </div>

      </div>

      {/* PEAK DINING HOURS & CATEGORY SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

        {/* Peak Hours Chart (8 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white p-4 sm:p-6 2xl:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-headline font-bold text-base 2xl:text-lg text-slate-900">Peak Dining Hours Traffic</h3>
              <p className="text-xs 2xl:text-sm text-slate-400">Order ticket volume per service hour</p>
            </div>
            <span className="self-start sm:self-auto text-xs 2xl:text-sm font-bold text-[#89023e] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
              Peak: 7:00 PM (48 orders)
            </span>
          </div>

          {/* Bar Chart Visualization with horizontal scroll on small devices */}
          <div className="overflow-x-auto no-scrollbar pt-4 pb-2">
            <div className="min-w-[420px] sm:min-w-0 h-52 sm:h-60 2xl:h-72 flex items-end justify-between gap-2 px-2">
              {peakHoursData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 group-hover:text-[#89023e] transition-colors">
                    {data.orders}
                  </span>
                  <div 
                    style={{ height: data.height }}
                    className={`w-full max-w-[38px] rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                      data.peak 
                        ? 'bg-gradient-to-t from-[#89023e] to-[#ea638c] shadow-md shadow-pink-200' 
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] 2xl:text-xs font-medium text-slate-500 whitespace-nowrap">
                    {data.hour}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Revenue Distribution (4 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white p-4 sm:p-6 2xl:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-headline font-bold text-base 2xl:text-lg text-slate-900">Category Revenue Split</h3>
            <p className="text-xs 2xl:text-sm text-slate-400">Distribution by course sales (INR)</p>
          </div>

          <div className="space-y-3.5 text-xs 2xl:text-sm">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Mains &amp; Grills</span>
                <span className="text-slate-900 font-bold">44% (₹81,070)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#89023e] rounded-full" style={{ width: '44%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Artisanal Cocktails</span>
                <span className="text-slate-900 font-bold">26% (₹47,905)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#ea638c] rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Small Plates &amp; Starters</span>
                <span className="text-slate-900 font-bold">18% (₹33,165)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Desserts</span>
                <span className="text-slate-900 font-bold">12% (₹22,110)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200 text-[11px] 2xl:text-xs text-[#89023e] font-medium mt-2">
            💡 <strong>Insight:</strong> Cocktail pairings added via QR touchpoints increased average beverage margin by 18%.
          </div>
        </div>

      </div>

      {/* TOP SELLING DISHES TABLE (Fully Responsive with Mobile Cards and Desktop Table) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 2xl:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-headline font-bold text-base 2xl:text-lg text-slate-900">Bestselling Menu Items</h3>
            <p className="text-xs 2xl:text-sm text-slate-400">Ranked by order velocity and digital QR conversions</p>
          </div>
          <span className="text-xs 2xl:text-sm font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Top 5 Dishes</span>
        </div>

        {/* Desktop & Tablet Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs 2xl:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Dish Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Portions Sold</th>
                <th className="py-3 px-4 text-right">Revenue Generated</th>
                <th className="py-3 px-5 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topSellers.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-[#89023e] flex items-center justify-center font-bold text-[10px] 2xl:text-xs">
                      {i + 1}
                    </span>
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3.5 px-4">{item.category}</td>
                  <td className="py-3.5 px-4 text-center font-bold">{item.sold}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#89023e]">{item.rev}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {item.margin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Screen List Cards (Clean and compact for 320px - 640px) */}
        <div className="sm:hidden divide-y divide-slate-100">
          {topSellers.map((item, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-[#89023e] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-snug">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.category} &bull; {item.sold} sold</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono font-bold text-[#89023e]">{item.rev}</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{item.margin} margin</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

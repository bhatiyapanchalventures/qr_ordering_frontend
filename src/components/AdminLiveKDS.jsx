import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChefHat, 
  Sparkles, 
  AlertCircle,
  Timer,
  Tv,
  Maximize2,
  Minimize2,
  Layers,
  Filter
} from 'lucide-react';

export const AdminLiveKDS = () => {
  const { 
    orders, 
    updateOrderStatus, 
    showToast, 
    soundEnabled, 
    setSoundEnabled, 
    playNewOrderBuzzer, 
    playOrderReadyBuzzer 
  } = useRestaurant();
  
  const [isTvMode, setIsTvMode] = useState(false);
  const [mobileStage, setMobileStage] = useState('all');

  const newOrders = orders.filter(o => o.status === 'new');
  const prepOrders = orders.filter(o => o.status === 'in-prep');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const servedOrders = orders.filter(o => o.status === 'served');

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    showToast(nextState ? 'Buzzer sounds activated for Kitchen and Waiters' : 'Buzzer sounds muted', 'info');
  };

  const toggleTvMode = () => {
    const nextMode = !isTvMode;
    setIsTvMode(nextMode);
    showToast(
      nextMode ? 'Switched to Kitchen Wall TV Display Mode (High Contrast)' : 'Returned to Standard KDS View',
      'info'
    );
  };

  return (
    <div className={`transition-colors duration-300 min-h-[calc(100vh-56px)] ${
      isTvMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className={`w-full mx-auto p-3 sm:p-5 lg:p-7 space-y-4 sm:space-y-6 ${
        isTvMode ? 'max-w-[1920px] 2xl:px-10' : 'max-w-7xl 2xl:max-w-[1920px]'
      }`}>

        {/* TOP KDS HEADER */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b ${
          isTvMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className={`text-xl sm:text-2xl 2xl:text-3xl font-bold font-headline tracking-tight flex items-center gap-2 ${
                isTvMode ? 'text-white' : 'text-slate-900'
              }`}>
                <ChefHat className={`w-6 h-6 sm:w-7 sm:h-7 ${isTvMode ? 'text-rose-400' : 'text-[#89023e]'}`} />
                <span>Kitchen Display System (KDS)</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Kitchen TV Line 01 &bull; Live
              </span>
            </div>
            <p className={`text-xs sm:text-sm 2xl:text-base mt-1 ${isTvMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time digital ticket stream dispatched from Table QR orders. Instant bump controls.
            </p>
          </div>

          {/* Top Controls: Sound, TV Mode & Active Tickets Counter */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* TV Display Mode Button */}
            <button 
              onClick={toggleTvMode}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs border ${
                isTvMode 
                  ? 'bg-rose-500 text-white border-rose-400 shadow-rose-950/60' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle Large TV / Kitchen Monitor Display Mode"
            >
              <Tv className="w-4 h-4 text-rose-400" />
              <span>{isTvMode ? 'TV Mode Active' : 'Kitchen TV Mode'}</span>
            </button>

            {/* Chime Sound Button */}
            <button 
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border transition-all ${
                soundEnabled 
                  ? (isTvMode ? 'bg-slate-900 text-rose-300 border-slate-700' : 'bg-pink-50 text-[#89023e] border-pink-200 shadow-2xs')
                  : (isTvMode ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200')
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Buzzers Active' : 'Buzzers Muted'}</span>
            </button>

            <div className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border ${
              isTvMode ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {orders.filter(o => o.status !== 'served').length} Active
            </div>
          </div>
        </div>

        {/* MOBILE STAGE FILTER SELECTOR (Visible only on mobile screens < 768px for zero-scroll station viewing) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'new', label: `Incoming (${newOrders.length})`, count: newOrders.length, color: 'text-rose-500' },
            { id: 'prep', label: `In Kitchen (${prepOrders.length})`, count: prepOrders.length, color: 'text-amber-500' },
            { id: 'ready', label: `Ready (${readyOrders.length})`, count: readyOrders.length, color: 'text-emerald-500' },
            { id: 'served', label: `History (${servedOrders.length})` }
          ].map(stage => (
            <button
              key={stage.id}
              onClick={() => setMobileStage(stage.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                mobileStage === stage.id
                  ? (isTvMode ? 'bg-rose-600 text-white border-rose-500' : 'bg-[#89023e] text-white border-[#89023e]')
                  : (isTvMode ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-white text-slate-700 border-slate-200')
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* KANBAN TICKET GRID (Responsive: 1 col on mobile or stage filtered, 2 cols on tablet, 4 cols on desktop/TV) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 2xl:gap-6 items-start">

          {/* 1. INCOMING / NEW */}
          {(mobileStage === 'all' || mobileStage === 'new') && (
            <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 min-h-[480px] ${
              isTvMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs 2xl:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isTvMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  Incoming / New ({newOrders.length})
                </span>
                <span className="text-[11px] 2xl:text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
                  Needs Firing
                </span>
              </div>

              <div className="space-y-3">
                {newOrders.length === 0 ? (
                  <div className={`p-8 text-center text-xs 2xl:text-sm italic ${isTvMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    No incoming orders waiting.
                  </div>
                ) : (
                  newOrders.map(order => (
                    <div 
                      key={order.id} 
                      className={`rounded-2xl border-2 border-rose-400 shadow-md p-4 2xl:p-5 space-y-3 transition-transform ${
                        isTvMode ? 'bg-slate-950 text-white shadow-rose-950/40' : 'bg-white'
                      }`}
                    >
                      <div className={`flex items-start justify-between pb-2 border-b ${
                        isTvMode ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <div>
                          <span className="text-base sm:text-lg 2xl:text-xl font-bold font-headline block">
                            Table {order.tableNumber}
                          </span>
                          <span className={`text-[11px] 2xl:text-xs ${isTvMode ? 'text-slate-400' : 'text-slate-400'}`}>
                            {order.zone} &bull; #{order.id}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-rose-500/30">
                          <Clock className="w-3.5 h-3.5" /> {order.elapsedMinutes}m ago
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-rose-400 mr-2 text-sm sm:text-base 2xl:text-lg">{item.qty}x</span>
                              <span className="font-semibold">{item.name}</span>
                              {item.notes && (
                                <span className={`text-[11px] sm:text-xs 2xl:text-sm block pl-5 italic ${
                                  isTvMode ? 'text-amber-300' : 'text-slate-500'
                                }`}>
                                  &bull; {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.specialRequest && (
                        <div className={`p-2.5 rounded-xl border text-xs 2xl:text-sm font-medium ${
                          isTvMode ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-pink-50 border-pink-200 text-[#89023e]'
                        }`}>
                          <strong>Note:</strong> {order.specialRequest}
                        </div>
                      )}

                      <button 
                        onClick={() => updateOrderStatus(order.id, 'in-prep')}
                        className="w-full py-2.5 2xl:py-3.5 rounded-xl bg-[#89023e] hover:bg-[#a0034a] text-white text-xs sm:text-sm 2xl:text-base font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                      >
                        <Flame className="w-4 h-4 2xl:w-5 2xl:h-5 text-amber-300" /> 
                        <span>Start Firing (Prep)</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. IN KITCHEN / FIRING */}
          {(mobileStage === 'all' || mobileStage === 'prep') && (
            <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 min-h-[480px] ${
              isTvMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs 2xl:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isTvMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  In Kitchen / Firing ({prepOrders.length})
                </span>
                <span className="text-[11px] 2xl:text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  Cooking Line
                </span>
              </div>

              <div className="space-y-3">
                {prepOrders.length === 0 ? (
                  <div className={`p-8 text-center text-xs 2xl:text-sm italic ${isTvMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    No tickets currently on cooking line.
                  </div>
                ) : (
                  prepOrders.map(order => (
                    <div 
                      key={order.id} 
                      className={`rounded-2xl border border-amber-500/50 shadow-md p-4 2xl:p-5 space-y-3 ${
                        isTvMode ? 'bg-slate-950 text-white' : 'bg-white'
                      }`}
                    >
                      <div className={`flex items-start justify-between pb-2 border-b ${
                        isTvMode ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <div>
                          <span className="text-base sm:text-lg 2xl:text-xl font-bold font-headline block">
                            Table {order.tableNumber}
                          </span>
                          <span className={`text-[11px] 2xl:text-xs ${isTvMode ? 'text-slate-400' : 'text-slate-400'}`}>
                            {order.zone} &bull; #{order.id}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-amber-500/30">
                          <Timer className="w-3.5 h-3.5" /> {order.elapsedMinutes}m cook
                        </span>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-amber-400 mr-2 text-sm sm:text-base 2xl:text-lg">{item.qty}x</span>
                              <span className="font-semibold">{item.name}</span>
                              {item.notes && (
                                <span className={`text-[11px] sm:text-xs 2xl:text-sm block pl-5 italic ${
                                  isTvMode ? 'text-amber-300' : 'text-slate-500'
                                }`}>
                                  &bull; {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.specialRequest && (
                        <div className={`p-2.5 rounded-xl border text-xs 2xl:text-sm font-medium ${
                          isTvMode ? 'bg-rose-950/40 border-rose-800 text-rose-200' : 'bg-pink-50 border-pink-200 text-[#89023e]'
                        }`}>
                          <strong>Note:</strong> {order.specialRequest}
                        </div>
                      )}

                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 2xl:py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm 2xl:text-base font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5" /> 
                        <span>Mark Plated &amp; Ready</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. PLATED / READY TO SERVE */}
          {(mobileStage === 'all' || mobileStage === 'ready') && (
            <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 min-h-[480px] ${
              isTvMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs 2xl:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isTvMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Plated / Ready ({readyOrders.length})
                </span>
                <span className="text-[11px] 2xl:text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  Runner Station
                </span>
              </div>

              <div className="space-y-3">
                {readyOrders.length === 0 ? (
                  <div className={`p-8 text-center text-xs 2xl:text-sm italic ${isTvMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    No tickets waiting for runner pass.
                  </div>
                ) : (
                  readyOrders.map(order => (
                    <div 
                      key={order.id} 
                      className={`rounded-2xl border border-emerald-500/50 shadow-md p-4 2xl:p-5 space-y-3 ${
                        isTvMode ? 'bg-slate-950 text-white' : 'bg-white'
                      }`}
                    >
                      <div className={`flex items-start justify-between pb-2 border-b ${
                        isTvMode ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <div>
                          <span className="text-base sm:text-lg 2xl:text-xl font-bold font-headline block">
                            Table {order.tableNumber}
                          </span>
                          <span className={`text-[11px] 2xl:text-xs ${isTvMode ? 'text-slate-400' : 'text-slate-400'}`}>
                            {order.zone} &bull; #{order.id}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hot on Pass
                        </span>
                      </div>

                      <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-emerald-400 mr-2 text-sm sm:text-base 2xl:text-lg">{item.qty}x</span>
                              <span className="font-semibold">{item.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => updateOrderStatus(order.id, 'served')}
                        className="w-full py-2.5 2xl:py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm 2xl:text-base font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                      >
                        <span>Delivered &bull; Bump Out</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. COMPLETED / SERVED */}
          {(mobileStage === 'all' || mobileStage === 'served') && (
            <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-3 min-h-[480px] ${
              isTvMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/70 border-slate-200'
            }`}>
              <div className="flex items-center justify-between px-1">
                <span className={`text-xs 2xl:text-sm font-bold uppercase tracking-wider ${
                  isTvMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Completed / Served ({servedOrders.length})
                </span>
                <span className={`text-[11px] 2xl:text-xs font-bold ${isTvMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  History
                </span>
              </div>

              <div className="space-y-3">
                {servedOrders.map(order => (
                  <div 
                    key={order.id} 
                    className={`rounded-2xl border p-3.5 2xl:p-4 space-y-2 opacity-80 hover:opacity-100 transition-opacity ${
                      isTvMode ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs 2xl:text-sm">
                      <span className="font-bold">Table {order.tableNumber}</span>
                      <span className="text-[10px] 2xl:text-xs text-slate-500">#{order.id}</span>
                    </div>
                    <div className="text-[11px] 2xl:text-xs text-slate-400">
                      {order.items.map((it, i) => `${it.qty}x ${it.name}`).join(', ')}
                    </div>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="text-[11px] 2xl:text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold pt-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Recall to Ready Pass
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

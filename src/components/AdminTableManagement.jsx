import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  LayoutGrid, 
  QrCode, 
  Printer, 
  Copy, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  X,
  FileDown,
  Layers,
  Search
} from 'lucide-react';

export const AdminTableManagement = ({ onLaunchCustomerView }) => {
  const { 
    tables, 
    updateTableStatus, 
    setActiveTable, 
    emergencyHold, 
    setEmergencyHold, 
    showToast 
  } = useRestaurant();

  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [qrModalTable, setQrModalTable] = useState(null);
  const [searchTable, setSearchTable] = useState('');

  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const availableCount = tables.filter(t => t.status === 'available').length;
  const loadPercentage = Math.round((occupiedCount / tables.length) * 100);

  const filteredTables = tables.filter(tbl => {
    const matchesZone = selectedZone === 'All' || tbl.zoneGroup === selectedZone;
    const matchesStatus = selectedStatus === 'All' || tbl.status === selectedStatus;
    const matchesSearch = tbl.number.includes(searchTable) || tbl.zone.toLowerCase().includes(searchTable.toLowerCase());
    return matchesZone && matchesStatus && matchesSearch;
  });

  const handleLaunchQR = (table) => {
    setActiveTable({ number: table.number, zone: table.zone });
    showToast(`Session bound to Table ${table.number} (${table.zone})`, 'info');
    if (onLaunchCustomerView) onLaunchCustomerView();
  };

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1920px] mx-auto p-3 sm:p-6 lg:p-8 2xl:p-10 space-y-5 sm:space-y-6">

      {/* SUB-HEADER / ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 tracking-tight">
              Table &amp; Floor QR Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-pink-50 text-[#89023e] border border-pink-200 font-semibold">
              Live Engine v2.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time table occupancy, QR touchpoints, tabletop printouts, and guest ordering slips.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setEmergencyHold(!emergencyHold)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              emergencyHold 
                ? 'bg-rose-600 text-white animate-pulse' 
                : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{emergencyHold ? 'Hold Active (Paused)' : 'Emergency Hold'}</span>
          </button>

          <button 
            onClick={() => showToast('Generated master vector PDF for all 24 table QR stands!', 'success')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export All QRs (PDF)</span>
          </button>
        </div>
      </div>

      {/* METRIC KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Tables</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-slate-900">{tables.length}</span>
              <span className="text-xs text-[#89023e] font-semibold">3 Zones</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Indoor &bull; Patio &bull; Rooftop</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#89023e]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-[#89023e]"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">Occupied Tables</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-[#89023e]">{occupiedCount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-[#89023e] border border-pink-200 font-semibold">
                {loadPercentage}% Load
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Active dining checks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#89023e]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">Available</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-emerald-600">{availableCount}</span>
              <span className="text-xs text-slate-500 font-medium">Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Sanitized &amp; Stand-ready</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active QR Scans */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500"></div>
          <div>
            <span className="text-xs font-medium text-slate-500">Active QR Sessions</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-headline font-bold text-indigo-600">14</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Avg order speed: 1.2m</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <QrCode className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER & ZONE BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Zone Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Indoor', 'Patio', 'Rooftop'].map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                selectedZone === zone
                  ? 'bg-[#89023e] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {zone === 'All' ? 'All Zones (24)' : `${zone} Tables`}
            </button>
          ))}
        </div>

        {/* Status Dropdown & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative text-xs w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#89023e]"
            >
              <option value="All">All Statuses</option>
              <option value="occupied">Occupied</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>

          <div className="relative text-xs w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search Table #..."
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-[#89023e]"
            />
          </div>
        </div>
      </div>

      {/* TABLE GRID (Responsive: 1-2 on mobile, 3 on tablet, 4 on desktop, 6 on 2xl/TV) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredTables.map(tbl => {
          const isOccupied = tbl.status === 'occupied';
          const isAvailable = tbl.status === 'available';

          return (
            <div 
              key={tbl.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-pink-300 transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div className={`h-1 w-full ${
                isOccupied ? 'bg-[#89023e]' : isAvailable ? 'bg-emerald-500' : 'bg-amber-400'
              }`} />

              <div className="p-4 space-y-3">
                {/* Header: Table No, Tag, Capacity */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-headline font-bold text-slate-900">Table {tbl.number}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {tbl.capacity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{tbl.zone}</p>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize flex items-center gap-1.5 ${
                    isOccupied 
                      ? 'bg-pink-50 text-[#89023e] border border-pink-200' 
                      : isAvailable 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {isOccupied && <span className="w-1.5 h-1.5 rounded-full bg-[#89023e] animate-ping"></span>}
                    {tbl.status}
                  </span>
                </div>

                {/* QR Code & URL Cluster */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div 
                    onClick={() => setQrModalTable(tbl)}
                    className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                    title="Click to expand QR stand preview"
                  >
                    <QrCode className="w-12 h-12 text-[#89023e]" />
                  </div>

                  <div className="overflow-hidden flex-1">
                    <span className="text-[11px] font-mono text-[#89023e] font-bold truncate block">
                      velvetbloom.menu/t{tbl.number}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button 
                        onClick={() => setQrModalTable(tbl)}
                        className="px-2 py-1 bg-pink-50 hover:bg-pink-100 text-[#89023e] rounded-lg text-[10px] font-bold border border-pink-200 flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3" /> Print Stand
                      </button>
                      <button 
                        onClick={() => handleLaunchQR(tbl)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold border border-slate-200 flex items-center gap-1 transition-colors"
                        title="Simulate customer opening this QR"
                      >
                        <ExternalLink className="w-3 h-3 text-[#89023e]" /> Open Menu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Live Check Stats */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Bill</span>
                    <span className="font-bold text-[#89023e] font-mono">₹{(tbl.bill || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Orders</span>
                    <span className="font-bold text-slate-800">{tbl.ordersCount || 0} rounds</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Seated</span>
                    <span className="font-bold text-slate-800 font-mono">{tbl.seatedMinutes ? `${tbl.seatedMinutes}m` : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <span>Server: <strong className="text-slate-800">{tbl.server}</strong></span>
                <select
                  value={tbl.status}
                  onChange={(e) => updateTableStatus(tbl.id, e.target.value)}
                  className="text-[10px] bg-white border border-slate-200 rounded-md px-1.5 py-0.5 font-semibold text-slate-700"
                >
                  <option value="available">Set Free</option>
                  <option value="occupied">Set Occupied</option>
                  <option value="reserved">Set Reserved</option>
                  <option value="cleaning">Set Cleaning</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR PRINT & STAND PREVIEW MODAL */}
      {qrModalTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tabletop QR Plaque</span>
              <button onClick={() => setQrModalTable(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plaque Canvas */}
            <div className="p-6 my-4 bg-slate-50 rounded-2xl border-2 border-dashed border-pink-200 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#89023e] text-white flex items-center justify-center font-bold text-sm mb-2 shadow-sm">
                VB
              </div>
              <h3 className="font-headline font-bold text-lg text-slate-900">Table {qrModalTable.number}</h3>
              <p className="text-xs text-slate-500">{qrModalTable.zone}</p>

              <div className="my-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                <QrCode className="w-36 h-36 text-[#89023e]" />
              </div>

              <div className="space-y-0.5 text-center">
                <span className="text-xs font-bold text-slate-900 block">Scan to View Menu &amp; Order</span>
                <span className="text-[11px] text-slate-500 block">Point phone camera &bull; Tap popup link</span>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 w-full flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>NFC Enabled</span>
                <span className="text-[#89023e] font-bold">velvetbloom.menu/t{qrModalTable.number}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  showToast(`Printed QR Plaque for Table ${qrModalTable.number} on stand printer!`, 'success');
                  setQrModalTable(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#89023e] hover:bg-[#720033] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" /> Print Plaque
              </button>
              <button 
                onClick={() => {
                  handleLaunchQR(qrModalTable);
                  setQrModalTable(null);
                }}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                title="Simulate customer opening"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building2, 
  ShieldCheck, 
  Save, 
  Volume2, 
  VolumeX, 
  Bell, 
  UtensilsCrossed, 
  MapPin, 
  FileText, 
  BadgeCheck, 
  CheckCircle2, 
  LogOut,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';

export const AdminProfile = ({ onNavigateBack }) => {
  const { 
    adminAuth, 
    updateAdminProfile, 
    logoutAdmin, 
    soundEnabled, 
    setSoundEnabled, 
    playNewOrderBuzzer, 
    playOrderReadyBuzzer, 
    playWaiterCallBuzzer,
    showToast 
  } = useRestaurant();

  const [name, setName] = useState(adminAuth?.name || 'Prashant Sharma');
  const [email, setEmail] = useState(adminAuth?.email || 'prashant.owner@velvetbloom.com');
  const [role, setRole] = useState(adminAuth?.role || 'General Manager & Operating Partner');
  const [isSaved, setIsSaved] = useState(false);

  // Mobile number is strictly read-only as requested
  const lockedPhone = '9586784989';

  const handleSave = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a valid Admin Name', 'warning');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid Email / Gmail address', 'warning');
      return;
    }

    updateAdminProfile({
      name: name.trim(),
      email: email.trim(),
      role: role.trim()
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6">

      {/* TOP HEADER & NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateBack ? onNavigateBack('analytics') : null}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#89023e]" />
              <span>Admin Profile &amp; Terminal Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage executive manager credentials, registered restaurant entity, and POS sound notifications.
            </p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Sign out & lock terminal"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Lock Terminal Session</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: PROFILE CARD & EDITABLE DETAILS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* MANAGER SUMMARY HERO CARD */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#2c0015] rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              
              {/* Creative Gradient Avatar with Initials */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#89023e] to-[#ea638c] text-white flex items-center justify-center font-headline font-bold text-2xl shadow-lg shadow-rose-950/60 border-2 border-rose-400/40 shrink-0">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD'}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white font-headline">{name}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified Manager
                  </span>
                </div>
                <p className="text-xs text-rose-300 font-medium">{role}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Smartphone className="w-3 h-3 text-slate-500" />
                  <span>+91 {lockedPhone}</span>
                  <span className="text-slate-600">&bull;</span>
                  <span>{email}</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Terminal Node: POS-TERM-01</span>
              <span className="text-emerald-400">Status: Terminal Active</span>
            </div>
          </div>

          {/* EDITABLE PROFILE FORM */}
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#89023e]" />
                <span>Account Credentials</span>
              </h3>
              <span className="text-[11px] text-slate-400">Manager Details</span>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Full Name */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Manager Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-[#89023e] focus:ring-1 focus:ring-[#89023e] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email / Gmail */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Email / Gmail Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. prashant@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-[#89023e] focus:ring-1 focus:ring-[#89023e] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Designation / Role */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Designation &amp; Responsibilities
                </label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. General Manager & Floor Director"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:bg-white focus:border-[#89023e] focus:ring-1 focus:ring-[#89023e] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Registered Mobile Number (IMMUTABLE / LOCKED AS REQUESTED) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span>Registered Authentication Mobile</span>
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  </label>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                    LOCKED &bull; READ-ONLY
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    disabled
                    value={`+91 ${lockedPhone}`}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-600 font-mono font-bold cursor-not-allowed select-none opacity-85"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Primary terminal security identifier. Phone number cannot be edited from POS client.</span>
                </p>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md flex items-center gap-2 active:scale-98 ${
                  isSaved 
                    ? 'bg-emerald-600 shadow-emerald-950/40' 
                    : 'bg-gradient-to-r from-[#89023e] to-[#a0034a] hover:from-[#a0034a] hover:to-[#bd0357] shadow-rose-950/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>


        {/* RIGHT COLUMN: RESTAURANT ENTITY & BUZZER CONTROLS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* RESTAURANT / COMPANY ENTITY DETAILS CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#89023e]" />
                <span>Restaurant Entity Details</span>
              </h3>
              <span className="text-[10px] bg-pink-50 text-[#89023e] font-bold px-2 py-0.5 rounded-full border border-pink-200">
                Active F&amp;B Outlet
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Brand &amp; Legal Entity</span>
                <span className="font-bold text-slate-900 text-sm">Velvet Bloom Bistro &amp; Highball Lounge</span>
                <span className="text-slate-500 block text-[11px]">Velvet Bloom Hospitality Private Limited</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Flagship Premise</span>
                <span className="font-semibold text-slate-800 flex items-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>Cyber City Flagship, Sector 29, Gurugram, Haryana &bull; 122002</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">GSTIN (5% GST)</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">07AAAAA0000A1Z5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">FSSAI License</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">10019011000432</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Terminal Version: Aura POS v2.4</span>
                <span className="text-emerald-600 font-bold">Node Sync 100%</span>
              </div>
            </div>
          </div>

          {/* BUZZER AUDIO & NOTIFICATIONS CARD (Moved cleanly here!) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#89023e]" />
                <span>Audio Alert Buzzers</span>
              </h3>
              
              {/* Sound Toggle Switch */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  soundEnabled 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? 'Buzzers ON' : 'Muted'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              When diners place an order via Table QR, this device and all kitchen monitors ring an acoustic kitchen ticket chime automatically.
            </p>

            {/* Manual Sound Testing Buttons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-700 block">Test Ringers on this Laptop / Screen:</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playNewOrderBuzzer();
                    showToast('🔔 Kitchen New Order Chime (Ding-Ding-Ding)!', 'info');
                  }}
                  className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-[#89023e] font-semibold flex items-center gap-2 transition-colors text-left"
                >
                  <Bell className="w-4 h-4 text-[#89023e] shrink-0" />
                  <div>
                    <span className="block font-bold">Kitchen Order Chime</span>
                    <span className="text-[10px] text-slate-500">3-tone ticket ring</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playOrderReadyBuzzer();
                    showToast('🍽️ Waiter Runner Pickup Bell (Ding-Dong)!', 'info');
                  }}
                  className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-2 transition-colors text-left"
                >
                  <UtensilsCrossed className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Waiter Runner Bell</span>
                    <span className="text-[10px] text-slate-500">2-tone pass bell</span>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


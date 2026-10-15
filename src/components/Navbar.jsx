import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { 
  Utensils, 
  QrCode, 
  ChefHat, 
  MenuSquare, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Lock, 
  LogOut, 
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ 
  currentView, 
  setCurrentView, 
  setPendingAdminView 
}) => {
  const { 
    cartCount, 
    orders, 
    toast, 
    adminAuth, 
    logoutAdmin 
  } = useRestaurant();

  const activeOrdersCount = orders.filter(o => o.status !== 'served').length;

  const navLinks = [
    { id: 'customer', label: 'Customer Menu', icon: QrCode, badge: cartCount > 0 ? cartCount : null, isPublic: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, isPublic: false },
    { id: 'kds', label: 'Live KDS', icon: ChefHat, badge: activeOrdersCount > 0 ? activeOrdersCount : null, isPublic: false },
    { id: 'tables', label: 'Tables & Floor', icon: Utensils, isPublic: false },
    { id: 'menu', label: 'Menu Manager', icon: MenuSquare, isPublic: false }
  ];

  const handleNavClick = (id, isPublic) => {
    if (!isPublic && !adminAuth) {
      if (setPendingAdminView) setPendingAdminView(id);
      setCurrentView('login');
    } else {
      setCurrentView(id);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'PS';
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <header className="bg-slate-950 text-white sticky top-0 z-50 border-b border-slate-800 shadow-xl">
        <div className="w-full max-w-7xl 2xl:max-w-[1920px] mx-auto px-3 sm:px-6 2xl:px-10 py-2.5 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setCurrentView('customer')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-10 2xl:h-10 rounded-xl bg-gradient-to-br from-[#89023e] to-[#ea638c] flex items-center justify-center text-white shadow-md shadow-pink-950/60 group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="font-headline font-bold text-sm sm:text-base 2xl:text-lg tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span>Velvet Bloom</span>
                <span className="text-[10px] 2xl:text-xs bg-rose-500/20 text-rose-300 px-1.5 sm:px-2 py-0.5 rounded-full border border-rose-500/30 font-sans font-semibold">
                  Aura POS
                </span>
              </div>
            </div>
          </div>

          {/* Desktop & Laptop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map(({ id, label, icon: Icon, badge, isPublic }) => {
              const isActive = currentView === id;
              const isLocked = !isPublic && !adminAuth;

              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id, isPublic)}
                  className={`px-3 py-1.5 2xl:px-4 2xl:py-2 rounded-xl text-xs 2xl:text-sm font-semibold flex items-center gap-1.5 transition-all relative ${
                    isActive 
                      ? 'bg-[#89023e] text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                  title={isLocked ? 'Management login required' : label}
                >
                  <Icon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
                  <span>{label}</span>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-amber-400/80 ml-0.5" />
                  )}
                  {badge !== null && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-400 text-slate-950 font-bold text-[10px] 2xl:text-xs">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Creative Admin Profile Avatar + Separate Lock Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {adminAuth ? (
              <div className="flex items-center gap-2">
                
                {/* 1. CREATIVE ADMIN PROFILE AVATAR / ICON BUTTON */}
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`group flex items-center gap-2 p-1 sm:pr-3 rounded-full sm:rounded-2xl transition-all border ${
                    currentView === 'profile'
                      ? 'bg-gradient-to-r from-rose-950/80 to-[#89023e]/50 border-rose-500 text-white shadow-md shadow-rose-950/50'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                  title="Admin Profile & Restaurant Details"
                >
                  {/* Luxury Gradient Avatar Circle with Initials & Online Dot */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-[#89023e] to-[#ea638c] text-white flex items-center justify-center font-headline font-bold text-xs shadow-sm border border-rose-400/40 group-hover:scale-105 transition-transform">
                      {getInitials(adminAuth.name)}
                    </div>
                    {/* Pulsing online badge */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
                  </div>

                  {/* Name and Role on tablet/desktop */}
                  <div className="hidden sm:block text-left pr-1">
                    <div className="text-xs font-bold leading-none text-white flex items-center gap-1">
                      <span>{adminAuth.name || 'Prashant'}</span>
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      +91 {adminAuth.id || '9586784989'}
                    </span>
                  </div>
                </button>

                {/* 2. SEPARATE LOCK ICON BUTTON (PURE ICON, NO TEXT AS REQUESTED) */}
                <button
                  onClick={() => {
                    logoutAdmin();
                    setCurrentView('customer');
                  }}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/80 flex items-center justify-center transition-all shadow-2xs active:scale-95"
                  title="Lock Terminal & Sign Out"
                  aria-label="Lock Terminal"
                >
                  <Lock className="w-4 h-4" />
                </button>

              </div>
            ) : (
              <button
                onClick={() => {
                  if (setPendingAdminView) setPendingAdminView('analytics');
                  setCurrentView('login');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  currentView === 'login'
                    ? 'bg-[#89023e] border-rose-400 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Navigation Bar (Horizontal Scrollable Strip) */}
        <div className="lg:hidden flex items-center justify-start border-t border-slate-800/80 px-2 sm:px-4 py-2 overflow-x-auto no-scrollbar gap-1 text-xs">
          {navLinks.map(({ id, label, icon: Icon, badge, isPublic }) => {
            const isActive = currentView === id;
            const isLocked = !isPublic && !adminAuth;

            return (
              <button
                key={id}
                onClick={() => handleNavClick(id, isPublic)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-[#89023e] text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
                {isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                {badge && <span className="ml-1 text-[10px] bg-rose-400 text-slate-900 px-1 rounded-full font-bold">{badge}</span>}
              </button>
            );
          })}

          {/* Profile Shortcut Tab on Mobile when logged in */}
          {adminAuth && (
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold whitespace-nowrap transition-colors border ${
                currentView === 'profile'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Profile</span>
            </button>
          )}
        </div>
      </header>

      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#89023e] text-white border border-rose-300 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-bounce max-w-md w-max">
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-rose-200 shrink-0" />}
          <span>{toast.message}</span>
          {toast.action && (
            <button 
              onClick={() => setCurrentView('kds')} 
              className="underline text-rose-200 ml-2 hover:text-white"
            >
              {toast.action} &rarr;
            </button>
          )}
        </div>
      )}
    </>
  );
};

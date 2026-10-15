import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { CustomerMenu } from './components/CustomerMenu';
import { AdminTableManagement } from './components/AdminTableManagement';
import { AdminLiveKDS } from './components/AdminLiveKDS';
import { AdminMenuManagement } from './components/AdminMenuManagement';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminLogin } from './components/AdminLogin';
import { AdminProfile } from './components/AdminProfile';

function AppContent() {
  const [currentView, setCurrentView] = useState('customer');
  const [pendingAdminView, setPendingAdminView] = useState('analytics');
  const { adminAuth } = useRestaurant();

  // If a protected view is selected without being authenticated, intercept with login
  const isProtectedView = ['tables', 'kds', 'menu', 'analytics', 'profile'].includes(currentView);
  const shouldShowLogin = currentView === 'login' || (isProtectedView && !adminAuth);

  const handleLoginSuccess = (target) => {
    // When admin logs in, open Analytics first as default
    setCurrentView(target || 'analytics');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Main Top Navigation */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        setPendingAdminView={setPendingAdminView}
      />

      {/* Main Viewport Content */}
      <div className="flex-1">
        {/* Customer QR View is public & accessible to all diners */}
        {currentView === 'customer' && (
          <CustomerMenu onNavigateToKDS={() => {
            if (adminAuth) {
              setCurrentView('kds');
            } else {
              setPendingAdminView('kds');
              setCurrentView('login');
            }
          }} />
        )}

        {/* Authentication Interceptor / Dedicated Login View */}
        {shouldShowLogin && (
          <AdminLogin 
            onLoginSuccess={handleLoginSuccess}
            targetView={isProtectedView ? currentView : pendingAdminView}
          />
        )}

        {/* Protected Admin Views (Only rendered if authenticated) */}
        {!shouldShowLogin && currentView === 'tables' && (
          <AdminTableManagement onLaunchCustomerView={() => setCurrentView('customer')} />
        )}

        {!shouldShowLogin && currentView === 'kds' && (
          <AdminLiveKDS />
        )}

        {!shouldShowLogin && currentView === 'menu' && (
          <AdminMenuManagement onLaunchCustomerView={() => setCurrentView('customer')} />
        )}

        {!shouldShowLogin && currentView === 'analytics' && (
          <AdminAnalytics />
        )}

        {!shouldShowLogin && currentView === 'profile' && (
          <AdminProfile onNavigateBack={(view) => setCurrentView(view || 'analytics')} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

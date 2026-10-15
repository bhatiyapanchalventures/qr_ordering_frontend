import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  KeyRound, 
  Store, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const AdminLogin = ({ onLoginSuccess, targetView = 'analytics' }) => {
  const { adminAuth, loginAdmin } = useRestaurant();
  
  const [managerId, setManagerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Exact credentials required
  const EXPECTED_ID = '9586784989';
  const EXPECTED_PASS = '600300';

  const handleFillDemo = () => {
    setManagerId(EXPECTED_ID);
    setPassword(EXPECTED_PASS);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setErrorMessage('');

    const cleanId = managerId.trim().replace(/\s+/g, '');
    const cleanPass = password.trim();

    if (!cleanId) {
      setErrorMessage('Please enter your 10-digit registered Phone / Manager ID.');
      return;
    }

    if (!cleanPass) {
      setErrorMessage('Please enter your 6-digit Management Access PIN.');
      return;
    }

    setIsLoading(true);

    // Realistic verification delay
    setTimeout(() => {
      if (cleanId === EXPECTED_ID && cleanPass === EXPECTED_PASS) {
        setIsLoading(false);
        setSuccessAnimation(true);
        
        loginAdmin({
          id: EXPECTED_ID,
          name: 'Prashant (GM / Owner)',
          role: 'General Manager & Floor Supervisor',
          terminal: 'POS-TERMINAL-01 (Flagship)',
          branch: 'Velvet Bloom • Cyber City Flagship',
          loginTime: new Date().toISOString()
        }, rememberTerminal);

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(targetView);
          }
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMessage(
          'Authentication failed. Invalid Phone ID or Access PIN. Terminal access is restricted to verified managers.'
        );
      }
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-slate-950 via-slate-900 to-[#2c0015] flex items-center justify-center p-4 sm:p-6 text-slate-100">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#89023e]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="relative w-full max-w-md">
        
        {/* Top Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#89023e] to-[#ea638c] text-white shadow-xl shadow-rose-950/60 mb-4 border border-rose-400/30">
            {successAnimation ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-300 animate-bounce" />
            ) : (
              <ShieldCheck className="w-8 h-8" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-white flex items-center justify-center gap-2">
            <span>Velvet Bloom</span>
            <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30 font-sans font-semibold">
              POS Terminal
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Restaurant Management, Live KDS &amp; Floor Administration
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#89023e] via-rose-500 to-amber-500"></div>

          {/* Manager Terminal Access Helper */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-rose-900/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <div>
                <span className="text-slate-400">Manager Terminal: </span>
                <span className="font-mono font-bold text-rose-300 tracking-wider">9586784989</span>
                <span className="text-slate-500 mx-1">&bull;</span>
                <span className="font-mono font-bold text-rose-300 tracking-wider">600300</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-semibold bg-[#89023e] hover:bg-[#a0034a] text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
              title="Click to fill credentials"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Fill</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Phone / Manager ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Manager Phone / Employee ID</span>
                <span className="text-[10px] text-slate-500">Registered SIM</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  placeholder="e.g. 9586784989"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#89023e] focus:border-rose-500 transition-all"
                  maxLength={15}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Security PIN / Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Management Access PIN</span>
                <span className="text-[10px] text-slate-500">6-Digit Key</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  inputMode="numeric"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/90 border border-slate-700/80 rounded-xl text-white font-mono text-sm tracking-widest placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#89023e] focus:border-rose-500 transition-all"
                  maxLength={10}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Terminal Checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberTerminal}
                  onChange={(e) => setRememberTerminal(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-[#89023e] focus:ring-rose-500 focus:ring-offset-slate-900"
                />
                <span>Keep terminal authenticated</span>
              </label>
              <span className="text-slate-500 font-mono text-[11px]">POS-01</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successAnimation}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-lg flex items-center justify-center gap-2 mt-2 ${
                successAnimation
                  ? 'bg-emerald-600 shadow-emerald-950/60'
                  : 'bg-gradient-to-r from-[#89023e] to-[#a0034a] hover:from-[#a0034a] hover:to-[#bd0357] shadow-rose-950/60 active:scale-[0.99]'
              } ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Terminal Security...</span>
                </>
              ) : successAnimation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Terminal Access Granted!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Console</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Terminal Footer Info */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Store className="w-3.5 h-3.5 text-rose-400" />
              <span>Cyber City Flagship</span>
              <span>&bull;</span>
              <span className="text-slate-400">Aura POS v2.4</span>
            </div>
          </div>
        </div>

        {/* Quick Help Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Need to browse the digital menu as a diner? You can return to{' '}
            <button
              onClick={() => onLoginSuccess('customer')}
              className="text-rose-400 hover:text-rose-300 underline font-medium"
            >
              Customer QR Menu
            </button>
            {' '}anytime without credentials.
          </p>
        </div>

      </div>
    </div>
  );
};


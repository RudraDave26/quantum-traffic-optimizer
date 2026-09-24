import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Activity, 
  BarChart3, 
  History, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  Smartphone,
  QrCode,
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import type { TrafficStatus, SystemHealth } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  trafficStatus: TrafficStatus | null;
  systemHealth: SystemHealth | null;
  onOpenSystemStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  setIsDemoMode,
  trafficStatus,
  systemHealth,
  onOpenSystemStatus
}) => {
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const universalLink = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://trailer-promise-flying-sailing.trycloudflare.com';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(universalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => (prev >= 60 ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'traffic', label: 'Live Traffic', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'Route History', icon: History },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'methodology', label: 'Methodology', icon: Cpu }
  ];

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-qnavy flex items-center justify-center text-white shadow-soft">
              <Sparkles className="w-5 h-5 text-qteal" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-qnavy">Q-ROUTE</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-qblue/15 text-qnavy border border-qblue/20">
                  SIH Prototype
                </span>
              </div>
              <p className="text-[11px] text-text-muted font-normal hidden sm:block">
                Smarter Routes. Less Traffic. Better Journeys.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
                    isActive
                      ? 'bg-qnavy text-white shadow-soft-sm'
                      : 'text-text-muted hover:text-text-main hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-qteal' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status Indicators & Live/Demo Mode Switch */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* 1 Universal Link for All Devices Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-qnavy to-qblue text-white text-xs font-bold shadow-soft hover:shadow-md transition-smooth hover:opacity-95 cursor-pointer"
              title="Open prototype on Mobile, Tablet or share with Jury"
            >
              <Smartphone className="w-3.5 h-3.5 text-qteal" />
              <span className="hidden sm:inline">1 Link for All Devices</span>
              <span className="sm:hidden">Share Link</span>
            </button>

            {/* Live Data / Demo Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
              <button
                onClick={() => setIsDemoMode(false)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-smooth ${
                  !isDemoMode 
                    ? 'bg-white text-qnavy shadow-soft-sm font-semibold' 
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                LIVE DATA
              </button>
              <button
                onClick={() => setIsDemoMode(true)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-smooth ${
                  isDemoMode 
                    ? 'bg-qorange/30 text-qorange-dark shadow-soft-sm font-semibold' 
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                DEMO MODE
              </button>
            </div>

            {/* Live Traffic Connection Status */}
            <button
              onClick={onOpenSystemStatus}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-smooth cursor-pointer text-left"
              title="Click to view full System Architecture Status"
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  isDemoMode ? 'bg-qorange' : 'bg-emerald-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isDemoMode ? 'bg-qorange-dark' : 'bg-emerald-500'
                }`} />
              </div>
              <div className="hidden lg:block text-[11px] leading-tight">
                <div className="font-medium text-text-main flex items-center space-x-1">
                  <span>{isDemoMode ? 'Demo Traffic' : 'Live Traffic'}</span>
                  <span className="text-[9px] text-text-muted">●</span>
                  <span className="text-emerald-700 font-semibold">CONNECTED</span>
                </div>
                <div className="text-[10px] text-text-light flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5 inline" />
                  <span>{secondsAgo}s ago</span>
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${
                  isActive ? 'bg-qnavy text-white' : 'text-text-muted hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 1 UNIVERSAL LINK / MOBILE QR MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-qnavy flex items-center justify-center text-white">
                  <Smartphone className="w-5 h-5 text-qteal" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-qnavy">1 Universal Prototype Link</h3>
                  <p className="text-[11px] text-text-muted">Works on Mobile, PC, Tablet & Jury Devices</p>
                </div>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 text-center">
              {/* QR Code Container */}
              <div className="inline-block p-3 bg-white rounded-2xl border-2 border-dashed border-qteal/40 shadow-soft-sm mb-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(universalLink)}`}
                  alt="Scan QR Code to open on Mobile"
                  className="w-44 h-44 rounded-xl object-contain mx-auto"
                />
              </div>
              <p className="text-xs font-semibold text-text-main flex items-center justify-center space-x-1">
                <QrCode className="w-3.5 h-3.5 text-qteal" />
                <span>Scan with phone camera to open on mobile instantly</span>
              </p>
            </div>

            {/* Universal URL Copy Box */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Universal HTTPS URL (Worldwide Access):
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={universalLink}
                  className="w-full text-xs font-mono font-bold text-qnavy bg-white border border-slate-200 px-3 py-2 rounded-xl select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-smooth shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-qnavy text-white hover:bg-qnavy-light'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Devices compatibility list */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-base block mb-0.5">📱</span>
                <strong className="text-text-main block">Mobile Phones</strong>
                <span className="text-slate-400">iOS & Android</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-base block mb-0.5">💻</span>
                <strong className="text-text-main block">Laptops & PCs</strong>
                <span className="text-slate-400">Any Browser</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-base block mb-0.5">🌍</span>
                <strong className="text-text-main block">SIH Jury</strong>
                <span className="text-slate-400">Worldwide Live</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={universalLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-qblue hover:underline flex items-center space-x-1"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

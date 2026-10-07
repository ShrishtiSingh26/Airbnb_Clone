'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Globe, 
  Menu, 
  User as UserIcon, 
  Heart, 
  Calendar as CalendarIcon, 
  Home as HomeIcon, 
  MapPin, 
  Plus, 
  Minus, 
  Building, 
  Sparkles,
  Compass,
  Bell,
  Palmtree,
  MessageSquare,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Gift
} from 'lucide-react';
import { User, SearchFilters } from '@/types';
import { LanguageModal } from '@/components/LanguageModal';
import toast from 'react-hot-toast';

interface HeaderProps {
  onOpenSearch?: () => void;
  currentUser?: User | null;
  onApplyFilters?: (filters: SearchFilters) => void;
}

const SUGGESTED_DESTINATIONS = [
  { name: 'North Goa, Goa', desc: 'Popular beach destination', query: 'Goa', icon: Palmtree, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
  { name: 'New Delhi, Delhi', desc: 'For sights like India Gate', query: 'Delhi', icon: Building, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
  { name: 'Pune, Maharashtra', desc: 'A hidden gem', query: 'Pune', icon: Compass, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
  { name: 'Bhopal, Madhya Pradesh', desc: 'Known for its lakes', query: 'Bhopal', icon: Sparkles, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50' },
  { name: 'Varanasi, Uttar Pradesh', desc: 'Off the beaten path', query: 'Varanasi', icon: MapPin, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50' },
  { name: 'Mumbai, Maharashtra', desc: 'For sights like Gateway of India', query: 'Mumbai', icon: Building, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentUser, onApplyFilters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Search popover state ('where' | 'when' | 'who' | null)
  const [activeSearchPopover, setActiveSearchPopover] = useState<'where' | 'when' | 'who' | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close search popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveSearchPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode enabled');
    }
  };

  // Search Inputs
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [guestAdults, setGuestAdults] = useState(1);
  const [guestChildren, setGuestChildren] = useState(0);

  const totalGuests = guestAdults + guestChildren;

  useEffect(() => {
    const syncSearchFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchLocation(params.get('location') || '');
      setSearchCheckIn(params.get('checkIn') || '');
      setSearchCheckOut(params.get('checkOut') || '');
      setGuestAdults(Number(params.get('guests')) || 1);
    };
    syncSearchFromUrl();
    window.addEventListener('popstate', syncSearchFromUrl);
    window.addEventListener('airbnb-search-clear', syncSearchFromUrl);
    return () => {
      window.removeEventListener('popstate', syncSearchFromUrl);
      window.removeEventListener('airbnb-search-clear', syncSearchFromUrl);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('airbnb-user-id');
    window.dispatchEvent(new Event('airbnb-user-change'));
    setIsMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleExecuteSearch = () => {
    const filters: SearchFilters = {
      location: searchLocation.trim() || undefined,
      checkIn: searchCheckIn || undefined,
      checkOut: searchCheckOut || undefined,
      guests: totalGuests > 0 ? totalGuests : undefined,
    };
    window.dispatchEvent(new CustomEvent('airbnb-search-submit', { detail: filters }));

    if (onApplyFilters) onApplyFilters(filters);
    else {
      const params = new URLSearchParams();
      params.set('search', '1');
      if (filters.location) params.set('location', filters.location);
      if (filters.checkIn) params.set('checkIn', filters.checkIn);
      if (filters.checkOut) params.set('checkOut', filters.checkOut);
      if (filters.guests) params.set('guests', String(filters.guests));
      router.push(`/?${params.toString()}`);
    }
    setActiveSearchPopover(null);
  };

  const displayName = currentUser?.name || 'Shrishti';
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xs transition-colors duration-300">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between min-h-20 py-2">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            onClick={() => { window.dispatchEvent(new Event('airbnb-search-clear')); }} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <svg
              className="h-8 w-auto text-airbnb transition-transform group-hover:scale-105"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.261 7.806-7.5 7.806-2.585 0-4.84-1.353-6.529-3.535l-.471-.628-.471.628c-1.688 2.182-3.944 3.535-6.529 3.535-4.239 0-7.5-3.798-7.5-7.806 0-1.074.256-2.097.896-3.578l.22-.486c.974-2.26 5.148-10.993 7.106-14.85l.527-1.011C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.282.607-3.374 2.584l-.442.852c-1.921 3.774-6.027 12.383-6.993 14.631l-.206.455c-.562 1.302-.785 2.133-.785 2.978 0 3.013 2.378 5.806 5.5 5.806 2.062 0 3.935-1.127 5.4-3.153l.9-1.246.9 1.246c1.465 2.026 3.338 3.153 5.4 3.153 3.122 0 5.5-2.793 5.5-5.806 0-.74-.184-1.5-.678-2.73l-.134-.326c-.958-2.215-5.061-10.821-6.988-14.593l-.447-.859C18.282 3.607 17.239 3 16 3zm0 11c1.933 0 3.5 1.567 3.5 3.5 0 2.21-2.01 4.5-3.5 5.864C14.51 22 12.5 19.71 12.5 17.5c0-1.933 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5 0 .973.996 2.368 1.5 3.01.504-.642 1.5-2.037 1.5-3.01 0-.828-.672-1.5-1.5-1.5z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-airbnb hidden sm:inline">
              airbnb
            </span>
          </Link>

          {/* Center Category & Persistent Search Bar */}
          <div className="hidden lg:flex flex-col items-center gap-2 flex-1 max-w-2xl px-6">
            
            {/* Nav Tabs */}
            <nav aria-label="Explore categories" className="flex items-center gap-8 text-sm font-semibold">
              <Link 
                href="/" 
                className={`flex items-center gap-2 pb-1.5 border-b-[2.5px] transition ${
                  pathname === '/' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 3D Globe Icon */}
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0 transform hover:scale-105 transition">
                  <path d="M11 28H21M16 23.5V28" stroke="#8B6B38" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M6.5 15.5C6.5 20.7467 10.7533 25 16 25C21.2467 25 25.5 20.7467 25.5 15.5" stroke="#C79D5E" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="13.5" r="9.5" fill="url(#globeGrad)" stroke="#B38947" strokeWidth="0.8" />
                  <path d="M10.5 10.5C11.5 9 13.5 8.5 15 9.5C16 10.2 14.5 12.5 13 12.5C12 12.5 10.5 11.5 10.5 10.5Z" fill="#5B9356" />
                  <path d="M16.5 13.5C18 13 20.5 13.5 21.5 15C21 17 19 17.5 17.5 17C16.5 16.5 16 14.5 16.5 13.5Z" fill="#5B9356" />
                  <path d="M11.5 16C12.5 15.5 14 16.5 13.5 18C13 19 11.5 18.5 11 17.5C10.5 17 11 16.3 11.5 16Z" fill="#5B9356" />
                  <ellipse cx="16" cy="13.5" rx="9.5" ry="3.8" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="1.5 1" opacity="0.65" />
                  <ellipse cx="16" cy="13.5" rx="4.2" ry="9.5" stroke="#FFFFFF" strokeWidth="0.7" strokeDasharray="1.5 1" opacity="0.65" />
                  <defs>
                    <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FFF4BC" />
                      <stop offset="55%" stopColor="#E6CA78" />
                      <stop offset="100%" stopColor="#C99E3F" />
                    </radialGradient>
                  </defs>
                </svg>
                <span>All</span>
              </Link>

              <Link 
                href="/homes" 
                className={`flex items-center gap-2 pb-1.5 border-b-[2.5px] transition ${
                  pathname === '/homes' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 3D House with Tree Icon */}
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0 transform hover:scale-105 transition">
                  <circle cx="8.5" cy="12.5" r="5.5" fill="#4B8B3B" />
                  <circle cx="6.5" cy="14.5" r="4" fill="#3D742E" />
                  <rect x="8" y="16" width="2.2" height="6.5" fill="#6B4226" rx="0.5" />
                  <path d="M12 15.5H25.5V23.5H12V15.5Z" fill="#D4D6D8" />
                  <path d="M11.5 15.5L18.75 9.5L26 15.5" stroke="#4A4E54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.5 15.5L18.75 10.2L25 15.5" fill="#60666D" />
                  <rect x="14" y="18.5" width="3.5" height="5" fill="#E81948" rx="0.5" />
                  <circle cx="16.6" cy="21" r="0.4" fill="#FFD700" />
                  <rect x="19.5" y="17.5" width="3.8" height="3.8" fill="#87CEEB" stroke="#4A4E54" strokeWidth="0.6" rx="0.5" />
                  <path d="M21.4 17.5V21.3M19.5 19.4H23.3" stroke="#4A4E54" strokeWidth="0.5" />
                  <path d="M3.5 24H28.5" stroke="#8F9499" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span>Homes</span>
              </Link>

              <Link 
                href="/experiences" 
                className={`flex items-center gap-2 pb-1.5 border-b-[2.5px] transition ${
                  pathname === '/experiences' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 3D Hot Air Balloon Icon */}
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0 transform hover:scale-105 transition">
                  <path d="M16 3.5C10.2 3.5 5.5 8.2 5.5 14C5.5 18.8 9.8 22 12.8 24L13.8 24.5H18.2L19.2 24C22.2 22 26.5 18.8 26.5 14C26.5 8.2 21.8 3.5 16 3.5Z" fill="url(#balloonGrad)" />
                  <path d="M16 3.5C12.8 7.8 12.8 18.5 13.8 24.5H18.2C19.2 18.5 19.2 7.8 16 3.5Z" fill="#FFC107" />
                  <path d="M16 3.5C10.8 7.8 9.8 18.5 12.8 24C10.8 20.5 7.8 17.2 7.8 14C7.8 8.8 11.2 4.8 16 3.5Z" fill="#E81948" />
                  <path d="M16 3.5C21.2 7.8 22.2 18.5 19.2 24C21.2 20.5 24.2 17.2 24.2 14C24.2 8.8 20.8 4.8 16 3.5Z" fill="#E81948" />
                  <path d="M13.2 24.5L14.2 27.5M18.8 24.5L17.8 27.5" stroke="#7A5230" strokeWidth="1.1" />
                  <rect x="13.8" y="27" width="4.4" height="3" fill="#A0673B" rx="0.8" stroke="#663F1D" strokeWidth="0.6" />
                  <defs>
                    <linearGradient id="balloonGrad" x1="5.5" y1="3.5" x2="26.5" y2="24.5" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF4B4B" />
                      <stop offset="50%" stopColor="#E81948" />
                      <stop offset="100%" stopColor="#900C27" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>Experiences</span>
              </Link>

              <Link 
                href="/services" 
                className={`flex items-center gap-2 pb-1.5 border-b-[2.5px] transition ${
                  pathname === '/services' 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 3D Desk Concierge Bell Icon */}
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0 transform hover:scale-105 transition">
                  <circle cx="16" cy="7.5" r="2" fill="#495057" />
                  <rect x="15" y="9" width="2" height="3" fill="#6C757D" />
                  <path d="M7.5 20.5C7.5 14.7 11.3 11.5 16 11.5C20.7 11.5 24.5 14.7 24.5 20.5H7.5Z" fill="url(#bellGrad)" stroke="#495057" strokeWidth="0.8" />
                  <path d="M10.5 18.5C10.5 15.2 12.8 13.2 16 12.8" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
                  <rect x="5.5" y="20.5" width="21" height="2.5" fill="#212529" rx="1" />
                  <rect x="4.5" y="23" width="23" height="2.2" fill="#111315" rx="0.8" />
                  <defs>
                    <linearGradient id="bellGrad" x1="7.5" y1="11.5" x2="24.5" y2="20.5" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F8F9FA" />
                      <stop offset="35%" stopColor="#DEE2E6" />
                      <stop offset="70%" stopColor="#CED4DA" />
                      <stop offset="100%" stopColor="#6C757D" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>Services</span>
              </Link>
            </nav>

            {/* Permanent Search Bar Pill with Embedded Dropdowns */}
            <div ref={searchBarRef} className="relative w-full max-w-xl">
              
              {/* Search Pill Container */}
              <div className="flex items-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition py-1.5 px-2 pl-3 text-xs w-full rounded-full relative z-20">
                
                {/* Where Segment */}
                <button
                  type="button"
                  onClick={() => setActiveSearchPopover(activeSearchPopover === 'where' ? null : 'where')}
                  className={`flex-1 border-r border-gray-200 dark:border-gray-700 px-3 py-1 text-left rounded-full transition ${
                    activeSearchPopover === 'where' ? 'bg-gray-100 dark:bg-gray-700 shadow-xs' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="block font-bold text-gray-900 dark:text-gray-100 text-[11px]">Where</span>
                  <span className="block text-gray-500 dark:text-gray-400 truncate text-[11px] font-normal">
                    {searchLocation || 'Search destinations'}
                  </span>
                </button>

                {/* When Segment */}
                <button
                  type="button"
                  onClick={() => setActiveSearchPopover(activeSearchPopover === 'when' ? null : 'when')}
                  className={`flex-1 border-r border-gray-200 dark:border-gray-700 px-3 py-1 text-left rounded-full transition ${
                    activeSearchPopover === 'when' ? 'bg-gray-100 dark:bg-gray-700 shadow-xs' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="block font-bold text-gray-900 dark:text-gray-100 text-[11px]">When</span>
                  <span className="block text-gray-500 dark:text-gray-400 truncate text-[11px] font-normal">
                    {searchCheckIn && searchCheckOut ? `${searchCheckIn} - ${searchCheckOut}` : 'Add dates'}
                  </span>
                </button>

                {/* Who Segment */}
                <button
                  type="button"
                  onClick={() => setActiveSearchPopover(activeSearchPopover === 'who' ? null : 'who')}
                  className={`flex-1 px-3 py-1 text-left rounded-full transition ${
                    activeSearchPopover === 'who' ? 'bg-gray-100 dark:bg-gray-700 shadow-xs' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span className="block font-bold text-gray-900 dark:text-gray-100 text-[11px]">Who</span>
                  <span className="block text-gray-500 dark:text-gray-400 truncate text-[11px] font-normal">
                    {totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}
                  </span>
                </button>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleExecuteSearch}
                  aria-label="Execute search"
                  className="bg-[#E81948] hover:bg-[#D90B60] text-white p-2.5 rounded-full flex items-center justify-center transition shrink-0 ml-1 shadow-sm active:scale-95"
                >
                  <Search size={14} className="stroke-[3]" />
                </button>

              </div>

              {/* Popover Dropdown: Where */}
              {activeSearchPopover === 'where' && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Suggested destinations</p>
                  
                  <div className="mb-3 px-1">
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Type a location (e.g. Mumbai, Delhi)..."
                      className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {SUGGESTED_DESTINATIONS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            setSearchLocation(item.query);
                            setActiveSearchPopover('when');
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition"
                        >
                          <div className={`p-2 rounded-xl ${item.color}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.name}</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popover Dropdown: When */}
              {activeSearchPopover === 'when' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 z-50 animate-in fade-in slide-in-from-top-2 space-y-4">
                  <p className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">Select your stay dates</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Check-in</label>
                      <input
                        type="date"
                        value={searchCheckIn}
                        onChange={(e) => setSearchCheckIn(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Checkout</label>
                      <input
                        type="date"
                        value={searchCheckOut}
                        onChange={(e) => setSearchCheckOut(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-2 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSearchPopover('who')}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-2 rounded-xl text-xs"
                  >
                    Next: Add guests
                  </button>
                </div>
              )}

              {/* Popover Dropdown: Who */}
              {activeSearchPopover === 'who' && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 z-50 animate-in fade-in slide-in-from-top-2 space-y-4 text-xs font-semibold">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">Adults</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuestAdults(Math.max(1, guestAdults - 1))}
                        disabled={guestAdults <= 1}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-40"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold w-4 text-center">{guestAdults}</span>
                      <button
                        type="button"
                        onClick={() => setGuestAdults(guestAdults + 1)}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">Children</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">Ages 2-12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuestChildren(Math.max(0, guestChildren - 1))}
                        disabled={guestChildren <= 0}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-700 disabled:opacity-40"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold w-4 text-center">{guestChildren}</span>
                      <button
                        type="button"
                        onClick={() => setGuestChildren(guestChildren + 1)}
                        className="p-1 rounded-full border border-gray-300 dark:border-gray-700"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExecuteSearch}
                    className="w-full bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Search stays
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Toggle Icon */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <Link
              href={currentUser ? '/host' : '/register?role=host&next=%2Fhost'}
              className="hidden sm:inline-flex text-xs font-bold text-gray-900 dark:text-gray-100 py-2.5 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Become a host
            </Link>

            {/* Profile Avatar Badge Button -> Directly redirects to /profile */}
            <Link
              href="/profile"
              title="Go to Profile"
              className="w-9 h-9 rounded-full bg-[#FCE7F3] dark:bg-rose-950 text-[#9D174D] dark:text-rose-200 font-bold text-xs flex items-center justify-center hover:opacity-90 shadow-xs transition border border-rose-200 dark:border-rose-900 cursor-pointer shrink-0"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initialLetter}</span>
              )}
            </Link>

            {/* Hamburger Menu Icon Button */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center transition border border-gray-200 dark:border-gray-700"
                aria-label="User navigation menu"
              >
                <Menu size={18} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs font-semibold text-gray-800 dark:text-gray-200">
                  
                  {/* Primary Nav Links */}
                  <div className="py-1 border-b border-gray-100 dark:border-gray-800">
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Heart size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Wishlists</span>
                    </Link>

                    <Link
                      href="/trips"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <CalendarIcon size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Trips</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        toast('Messages feature coming soon');
                      }}
                      className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                    >
                      <MessageSquare size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Messages</span>
                    </button>

                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <UserIcon size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Profile</span>
                    </Link>
                  </div>

                  {/* Settings & Info Section */}
                  <div className="py-1 border-b border-gray-100 dark:border-gray-800">
                    <Link
                      href="/notifications"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Bell size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Notifications</span>
                    </Link>

                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Settings size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Account settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsLanguageModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                    >
                      <Globe size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Languages & currency</span>
                    </button>

                    <Link
                      href="/help"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3.5 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <HelpCircle size={16} className="text-gray-600 dark:text-gray-400" />
                      <span>Help Centre</span>
                    </Link>

                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-gray-600 dark:text-gray-400" />}
                        <span>Dark Mode</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-airbnb' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  </div>

                  {currentUser ? (
                    <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                      <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400">
                        Signed in as {currentUser.is_host ? 'Host' : 'Guest'}
                      </p>
                      {currentUser.is_host ? (
                        <Link
                          href="/host"
                          onClick={() => setIsMenuOpen(false)}
                          className="mt-2 block rounded-xl px-3 py-2 font-bold text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                        >
                          Host dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/host"
                          onClick={() => setIsMenuOpen(false)}
                          className="mt-2 block rounded-xl px-3 py-2 font-bold text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                        >
                          Become a host
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 border-b border-gray-100 p-4 dark:border-gray-800">
                      <div>
                        <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Guest</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/login?next=%2F"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-center font-bold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          >
                            Log in
                          </Link>
                          <Link
                            href="/register?role=guest&next=%2F"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-xl bg-airbnb px-3 py-2 text-center font-bold text-white hover:bg-airbnb-dark"
                          >
                            Sign up
                          </Link>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Host</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/login?next=%2Fhost"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-xl border border-gray-200 px-3 py-2 text-center font-bold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                          >
                            Log in
                          </Link>
                          <Link
                            href="/register?role=host&next=%2Fhost"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-xl bg-airbnb px-3 py-2 text-center font-bold text-white hover:bg-airbnb-dark"
                          >
                            Sign up
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Become a Host Card Promo */}
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <Link
                      href="/referrals"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-2 py-2 mt-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                    >
                      Refer a host
                    </Link>

                    <Link
                      href="/referrals"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                    >
                      Find a co-host
                    </Link>
                  </div>

                  {/* Log out / Auth */}
                  <div className="p-2">
                    {currentUser ? (
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold rounded-xl"
                      >
                        Log out
                      </button>
                    ) : null}
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Language Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </header>
  );
};

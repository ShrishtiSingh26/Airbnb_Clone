'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Globe, Menu, User as UserIcon } from 'lucide-react';

export default function HelpCentrePage() {
  const [activeTab, setActiveTab] = useState<'guest' | 'homeHost' | 'expHost' | 'serviceHost' | 'travelAdmin'>('guest');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Help Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-auto text-airbnb"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.261 7.806-7.5 7.806-2.585 0-4.84-1.353-6.529-3.535l-.471-.628-.471.628c-1.688 2.182-3.944 3.535-6.529 3.535-4.239 0-7.5-3.798-7.5-7.806 0-1.074.256-2.097.896-3.578l.22-.486c.974-2.26 5.148-10.993 7.106-14.85l.527-1.011C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.282.607-3.374 2.584l-.442.852c-1.921 3.774-6.027 12.383-6.993 14.631l-.206.455c-.562 1.302-.785 2.133-.785 2.978 0 3.013 2.378 5.806 5.5 5.806 2.062 0 3.935-1.127 5.4-3.153l.9-1.246.9 1.246c1.465 2.026 3.338 3.153 5.4 3.153 3.122 0 5.5-2.793 5.5-5.806 0-.74-.184-1.5-.678-2.73l-.134-.326c-.958-2.215-5.061-10.821-6.988-14.593l-.447-.859C18.282 3.607 17.239 3 16 3zm0 11c1.933 0 3.5 1.567 3.5 3.5 0 2.21-2.01 4.5-3.5 5.864C14.51 22 12.5 19.71 12.5 17.5c0-1.933 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5 0 .973.996 2.368 1.5 3.01.504-.642 1.5-2.037 1.5-3.01 0-.828-.672-1.5-1.5-1.5z" />
          </svg>
          <span className="text-base font-bold text-gray-900 dark:text-white">Help Centre</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#9D174D] font-bold text-xs flex items-center justify-center">
            S
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Title & Search */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hi Shrishti, how can we help?
          </h1>

          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search how-tos and more"
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-4 pl-6 pr-14 text-sm font-semibold focus:outline-none shadow-xs"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#E81948] hover:bg-[#D90B60] text-white p-3 rounded-full shadow-md transition">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-8 text-xs font-bold overflow-x-auto pb-3">
            {[
              { id: 'guest', label: 'Guest' },
              { id: 'homeHost', label: 'Home host' },
              { id: 'expHost', label: 'Experience host' },
              { id: 'serviceHost', label: 'Service host' },
              { id: 'travelAdmin', label: 'Travel admin' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1 border-b-2 shrink-0 transition ${
                  activeTab === tab.id
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Cards */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold">Recommended for you</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-md">
                Action Required
              </span>
              <h4 className="text-sm font-bold">Your identity is not fully verified</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                Identity verification helps us check that you're really you. It's one of the ways we keep Airbnb secure.
              </p>
              
              <div className="pt-2 space-y-2 border-t border-gray-100 dark:border-gray-700">
                <Link href="/account" className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white hover:underline py-1">
                  <span>Check identity verification status</span>
                  <ChevronRight size={14} />
                </Link>
                <button className="flex items-center justify-between w-full text-xs font-bold text-gray-900 dark:text-white hover:underline py-1 text-left">
                  <span>Learn more</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xs space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                Quick Link
              </span>
              <h4 className="text-sm font-bold">Finding your reservation details</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
                Your Trips tab has full details, receipts, and Host contact info for each of your reservations.
              </p>
              
              <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                <Link href="/trips" className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white hover:underline py-1">
                  <span>Go to Trips</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ReferralsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'home' | 'experience' | 'service'>('experience');

  const handleShareReferral = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Host Navigation Bar */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" aria-label="Go home">
          <svg className="h-8 w-auto text-airbnb" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.261 7.806-7.5 7.806-2.585 0-4.84-1.353-6.529-3.535l-.471-.628-.471.628c-1.688 2.182-3.944 3.535-6.529 3.535-4.239 0-7.5-3.798-7.5-7.806 0-1.074.256-2.097.896-3.578l.22-.486c.974-2.26 5.148-10.993 7.106-14.85l.527-1.011C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.282.607-3.374 2.584l-.442.852c-1.921 3.774-6.027 12.383-6.993 14.631l-.206.455c-.562 1.302-.785 2.133-.785 2.978 0 3.013 2.378 5.806 5.5 5.806 2.062 0 3.935-1.127 5.4-3.153l.9-1.246.9 1.246c1.465 2.026 3.338 3.153 5.4 3.153 3.122 0 5.5-2.793 5.5-5.806 0-.74-.184-1.5-.678-2.73l-.134-.326c-.958-2.215-5.061-10.821-6.988-14.593l-.447-.859C18.282 3.607 17.239 3 16 3zm0 11c1.933 0 3.5 1.567 3.5 3.5 0 2.21-2.01 4.5-3.5 5.864C14.51 22 12.5 19.71 12.5 17.5c0-1.933 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5 0 .973.996 2.368 1.5 3.01.504-.642 1.5-2.037 1.5-3.01 0-.828-.672-1.5-1.5-1.5z" />
          </svg>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-700 dark:text-gray-300">
          <Link href="/host" className="hover:text-black dark:hover:text-white">Today</Link>
          <Link href="/host" className="hover:text-black dark:hover:text-white">Calendar</Link>
          <Link href="/host" className="hover:text-black dark:hover:text-white">Listings</Link>
          <Link href="/messages" className="hover:text-black dark:hover:text-white">Messages</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-bold hover:underline hidden sm:inline">Switch to travelling</Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#9D174D] font-bold text-xs flex items-center justify-center">S</Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-12">
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Refer a host, earn cash
        </h1>

        {/* Category Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          
          <button
            onClick={() => setSelectedCategory('home')}
            className={`p-5 rounded-3xl border transition flex items-center justify-between ${
              selectedCategory === 'home'
                ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <div>
              <p className="text-sm font-bold">Home</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Not available in your area.</p>
            </div>
            <span className="text-2xl">🏡</span>
          </button>

          <button
            onClick={() => setSelectedCategory('experience')}
            className={`p-5 rounded-3xl border transition flex items-center justify-between ${
              selectedCategory === 'experience'
                ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <div>
              <p className="text-sm font-bold">Experience</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You'll earn ₹4,820 INR</p>
            </div>
            <span className="text-2xl">🎈</span>
          </button>

          <button
            onClick={() => setSelectedCategory('service')}
            className={`p-5 rounded-3xl border transition flex items-center justify-between ${
              selectedCategory === 'service'
                ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <div>
              <p className="text-sm font-bold">Service</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You'll earn ₹1,928 INR – ₹9,640 INR</p>
            </div>
            <span className="text-2xl">🛎️</span>
          </button>

        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleShareReferral}
            className="bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-4 px-12 rounded-2xl shadow-lg transition text-sm"
          >
            Share referral link
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 pt-8 font-medium">
          Eligible locations & listing types only. Amounts expire on 6 Dec 2026. <span className="underline cursor-pointer">Terms apply</span> · <span className="underline cursor-pointer">How referrals work</span>
        </p>

      </div>

    </div>
  );
}

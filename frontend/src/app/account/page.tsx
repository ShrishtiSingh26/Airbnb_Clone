'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Hand, 
  Bell, 
  FileText, 
  CreditCard, 
  Globe, 
  Users, 
  Briefcase,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'privacy' | 'notifications' | 'payments' | 'languages'>('personal');

  // Personal info state
  const [legalName, setLegalName] = useState('Shrishti Singh');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleSaveField = (field: string) => {
    if (field === 'name' && tempValue.trim()) {
      setLegalName(tempValue.trim());
      toast.success('Legal name updated');
    } else {
      toast.success('Information updated');
    }
    setEditingField(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Top Simple Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" aria-label="Go home">
          <svg
            className="h-8 w-auto text-airbnb"
            viewBox="0 0 32 32"
            fill="currentColor"
          >
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.261 7.806-7.5 7.806-2.585 0-4.84-1.353-6.529-3.535l-.471-.628-.471.628c-1.688 2.182-3.944 3.535-6.529 3.535-4.239 0-7.5-3.798-7.5-7.806 0-1.074.256-2.097.896-3.578l.22-.486c.974-2.26 5.148-10.993 7.106-14.85l.527-1.011C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.282.607-3.374 2.584l-.442.852c-1.921 3.774-6.027 12.383-6.993 14.631l-.206.455c-.562 1.302-.785 2.133-.785 2.978 0 3.013 2.378 5.806 5.5 5.806 2.062 0 3.935-1.127 5.4-3.153l.9-1.246.9 1.246c1.465 2.026 3.338 3.153 5.4 3.153 3.122 0 5.5-2.793 5.5-5.806 0-.74-.184-1.5-.678-2.73l-.134-.326c-.958-2.215-5.061-10.821-6.988-14.593l-.447-.859C18.282 3.607 17.239 3 16 3zm0 11c1.933 0 3.5 1.567 3.5 3.5 0 2.21-2.01 4.5-3.5 5.864C14.51 22 12.5 19.71 12.5 17.5c0-1.933 1.567-3.5 3.5-3.5zm0 2c-.828 0-1.5.672-1.5 1.5 0 .973.996 2.368 1.5 3.01.504-.642 1.5-2.037 1.5-3.01 0-.828-.672-1.5-1.5-1.5z" />
          </svg>
        </Link>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-6 py-2 rounded-full text-xs transition"
        >
          Done
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight">Account settings</h1>

            <div className="space-y-1">
              
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                  activeTab === 'personal'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <UserIcon size={18} />
                <span>Personal information</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                  activeTab === 'security'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <ShieldCheck size={18} />
                <span>Login & security</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                  activeTab === 'privacy'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <Hand size={18} />
                <span>Privacy</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                  activeTab === 'notifications'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => toast('Taxes section loaded')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition text-left"
              >
                <FileText size={18} />
                <span>Taxes</span>
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
              >
                <div className="flex items-center gap-3.5">
                  <CreditCard size={18} />
                  <span>Payments</span>
                </div>
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">New</span>
              </button>

              <button
                onClick={() => setActiveTab('languages')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
              >
                <div className="flex items-center gap-3.5">
                  <Globe size={18} />
                  <span>Languages & translation</span>
                </div>
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">New</span>
              </button>

              <button
                onClick={() => toast('Booking permissions managed')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition text-left"
              >
                <Users size={18} />
                <span>Booking permissions</span>
              </button>

              <button
                onClick={() => toast('Travel for work settings')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition text-left"
              >
                <Briefcase size={18} />
                <span>Travel for work</span>
              </button>

            </div>
          </div>

          {/* Main Content Details */}
          <div className="lg:col-span-8 space-y-8 lg:border-l lg:border-gray-200 dark:lg:border-gray-800 lg:pl-10">
            
            {activeTab === 'personal' && (
              <div className="space-y-6">
                
                {/* Legal Name */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Legal name</h3>
                    {editingField === 'name' ? (
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-3 py-1.5 text-xs font-semibold"
                        />
                        <button onClick={() => handleSaveField('name')} className="p-1.5 bg-airbnb text-white rounded-lg"><Check size={14}/></button>
                        <button onClick={() => setEditingField(null)} className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"><X size={14}/></button>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{legalName}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { setEditingField('name'); setTempValue(legalName); }}
                    className="text-xs font-bold text-gray-900 dark:text-gray-100 underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Preferred First Name */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Preferred first name</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not provided</p>
                  </div>
                  <button onClick={() => toast('Add preferred name')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline">Add</button>
                </div>

                {/* Email Address */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Email address</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">s***1@gmail.com</p>
                  </div>
                  <button onClick={() => toast('Edit email')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline">Edit</button>
                </div>

                {/* Phone Numbers */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div className="pr-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Phone numbers</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they're used.
                    </p>
                  </div>
                  <button onClick={() => toast('Add phone number')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline shrink-0">Add</button>
                </div>

                {/* Identity Verification */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Identity verification</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not started</p>
                  </div>
                  <button onClick={() => toast('Start verification')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline">Start</button>
                </div>

                {/* Residential Address */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Residential address</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not provided</p>
                  </div>
                  <button onClick={() => toast('Add residential address')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline">Add</button>
                </div>

                {/* Postal Address */}
                <div className="py-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Postal address</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Not provided</p>
                  </div>
                  <button onClick={() => toast('Add postal address')} className="text-xs font-bold text-gray-900 dark:text-gray-100 underline">Add</button>
                </div>

              </div>
            )}

            {activeTab !== 'personal' && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{activeTab} Settings</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Manage your preferences for {activeTab} below.</p>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

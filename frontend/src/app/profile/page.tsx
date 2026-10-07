'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Users, MessageSquare, Edit3, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { User } from '@/types';
import { api, getCurrentUserId } from '@/services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'connections'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      api.getUser(userId)
        .then((u) => {
          setCurrentUser(u);
          setEditName(u.name);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      // Default demo profile if guest
      setCurrentUser({
        id: 1,
        name: 'Shrishti',
        email: 'shrishti@example.com',
        is_host: false,
        is_superhost: false,
      });
      setEditName('Shrishti');
      setLoading(false);
    }
  }, []);

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    if (currentUser) {
      setCurrentUser({ ...currentUser, name: editName });
      toast.success('Profile updated');
    }
    setIsEditing(false);
  };

  const displayName = currentUser?.name || 'Shrishti';
  const initialLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans py-10 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Sidebar */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile</h1>
            <div className="p-2 border border-gray-300 rounded-xl text-gray-700">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'about'
                  ? 'bg-gray-100 text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                {initialLetter}
              </div>
              <span className="text-sm">About me</span>
            </button>

            <button
              onClick={() => setActiveTab('connections')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
                activeTab === 'connections'
                  ? 'bg-gray-100 text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                <Users size={16} />
              </div>
              <span className="text-sm">Connections</span>
            </button>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-10 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0">
          
          {activeTab === 'about' ? (
            <div className="space-y-10">
              
              {/* Header */}
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-900">About me</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-4 py-1.5 rounded-full text-xs transition"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing && (
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 max-w-md">
                  <h3 className="text-sm font-bold text-gray-900">Edit Name</h3>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:outline-none focus:border-black font-semibold"
                  />
                  <button
                    onClick={handleSaveName}
                    className="bg-[#E81948] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm hover:bg-[#D90B60] transition"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Profile Card & Complete Profile Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                
                {/* Avatar Badge Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md text-center space-y-3 max-w-sm mx-auto lg:mx-0 w-full">
                  <div className="w-28 h-28 rounded-full bg-[#FCE7F3] text-[#9D174D] font-bold text-4xl flex items-center justify-center mx-auto shadow-xs border-2 border-white">
                    {initialLetter}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900">{displayName}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {currentUser?.is_host ? 'Host' : 'Guest'}
                    </p>
                  </div>
                </div>

                {/* Complete Your Profile Details */}
                <div className="space-y-4 max-w-md">
                  <h3 className="text-xl font-bold text-gray-900">Complete your profile</h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
                  </p>
                  <button
                    onClick={() => toast.success('Profile setup process started')}
                    className="bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-3 px-8 rounded-2xl text-xs shadow-md transition duration-200"
                  >
                    Get started
                  </button>
                </div>

              </div>

              <hr className="border-gray-200" />

              {/* Reviews Link */}
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-gray-800" />
                <button
                  onClick={() => toast("No written reviews yet")}
                  className="text-xs font-semibold text-gray-900 underline hover:text-black"
                >
                  Show reviews I've written
                </button>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Connections</h2>
              <p className="text-xs text-gray-600">Connect your social accounts and contacts to find friends on Airbnb.</p>
              
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-3 max-w-md">
                <p className="text-xs font-bold text-gray-900">No connections yet</p>
                <p className="text-[11px] text-gray-500">When you connect your contacts, friends visiting your area will be shown here.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

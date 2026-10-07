'use client';

import React from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim?: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose, onClaim }) => {
  if (!isOpen) return null;

  const handleClaim = () => {
    toast.success('10% discount claimed! Applied to your next stay.');
    if (onClaim) onClaim();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative border border-gray-100 dark:border-gray-800 text-center text-gray-900 dark:text-gray-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close promo"
          className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition text-gray-700 dark:text-gray-300"
        >
          <X size={18} />
        </button>

        {/* 3D Villa Illustration */}
        <div className="pt-2">
          <img
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80"
            alt="3D Villa"
            className="w-48 h-40 mx-auto rounded-3xl object-cover shadow-xl border-4 border-white dark:border-gray-800 transform hover:scale-105 transition"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-extrabold tracking-tight">
            Take 10% off your next stay
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-normal px-2">
            Here's something to make your next getaway even better. Get 10% off – up to ₹2,000 – when you book within 7 days of claiming this offer.{' '}
            <span className="underline font-semibold cursor-pointer text-gray-800 dark:text-gray-200">Terms apply</span>
          </p>
        </div>

        {/* Claim Action Button */}
        <button
          onClick={handleClaim}
          className="w-full bg-[#E81948] hover:bg-[#D90B60] text-white font-bold py-3.5 rounded-2xl shadow-lg transition text-sm tracking-wide"
        >
          Claim now
        </button>

      </div>
    </div>
  );
};

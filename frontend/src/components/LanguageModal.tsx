'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_LANGUAGES = [
  { name: 'English', region: 'United States', code: 'en-US' },
  { name: 'English', region: 'United Kingdom', code: 'en-GB' },
  { name: 'हिन्दी', region: 'भारत', code: 'hi-IN' },
  { name: 'ಕನ್ನಡ', region: 'ಭಾರತ', code: 'kn-IN' },
  { name: 'मराठी', region: 'भारत', code: 'mr-IN' },
];

const ALL_LANGUAGES = [
  { name: 'English', region: 'India', code: 'en-IN' },
  { name: 'Azərbaycan dili', region: 'Azərbaycan', code: 'az-AZ' },
  { name: 'Bahasa Indonesia', region: 'Indonesia', code: 'id-ID' },
  { name: 'Bosanski', region: 'Bosna i Hercegovina', code: 'bs-BA' },
  { name: 'Català', region: 'Espanya', code: 'ca-ES' },
  { name: 'Čeština', region: 'Česká republika', code: 'cs-CZ' },
  { name: 'Crnogorski', region: 'Crna Gora', code: 'cnr-ME' },
  { name: 'Dansk', region: 'Danmark', code: 'da-DK' },
  { name: 'Deutsch', region: 'Deutschland', code: 'de-DE' },
  { name: 'Deutsch', region: 'Österreich', code: 'de-AT' },
  { name: 'Deutsch', region: 'Schweiz', code: 'de-CH' },
  { name: 'Eesti', region: 'Eesti', code: 'et-EE' },
  { name: 'English', region: 'Australia', code: 'en-AU' },
  { name: 'English', region: 'Canada', code: 'en-CA' },
  { name: 'English', region: 'Ireland', code: 'en-IE' },
  { name: 'English', region: 'New Zealand', code: 'en-NZ' },
  { name: 'English', region: 'Singapore', code: 'en-SG' },
];

const CURRENCIES = [
  { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  { name: 'US Dollar', symbol: '$', code: 'USD' },
  { name: 'Euro', symbol: '€', code: 'EUR' },
  { name: 'British Pound', symbol: '£', code: 'GBP' },
  { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  { name: 'Australian Dollar', symbol: '$', code: 'AUD' },
  { name: 'Canadian Dollar', symbol: '$', code: 'CAD' },
  { name: 'Singapore Dollar', symbol: '$', code: 'SGD' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 max-w-4xl w-full max-h-[85vh] rounded-3xl shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-8 text-sm font-bold">
            <button
              onClick={() => setActiveTab('language')}
              className={`pb-1 border-b-2 transition ${
                activeTab === 'language' 
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Language and region
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className={`pb-1 border-b-2 transition ${
                activeTab === 'currency' 
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Currency
            </button>
          </div>

          <button onClick={onClose} aria-label="Close modal" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X size={18} />
          </button>
        </div>

        {activeTab === 'language' ? (
          <div className="space-y-8">
            
            {/* Suggested */}
            <div>
              <h3 className="text-base font-bold mb-4">Suggested languages and regions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {SUGGESTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      toast.success(`Language set to ${lang.name} (${lang.region})`);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      selectedLang === lang.code
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    <p className="text-xs font-bold">{lang.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{lang.region}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose language */}
            <div>
              <h3 className="text-base font-bold mb-1">Choose a language and region</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                You can manage more language preferences in your <a href="/account" className="underline font-semibold">Account settings</a>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ALL_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      toast.success(`Language set to ${lang.name} (${lang.region})`);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      selectedLang === lang.code
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                    }`}
                  >
                    <p className="text-xs font-bold">{lang.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{lang.region}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-base font-bold mb-4">Choose a currency</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr.code);
                    toast.success(`Currency set to ${curr.name} (${curr.symbol})`);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border text-left transition ${
                    selectedCurrency === curr.code
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
                  }`}
                >
                  <p className="text-xs font-bold">{curr.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{curr.code} – {curr.symbol}</p>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

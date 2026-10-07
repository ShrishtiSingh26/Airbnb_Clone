'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="min-h-[70vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 px-4 py-12 max-w-7xl mx-auto">
      
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-16">
        Notifications
      </h1>

      <div className="flex flex-col items-center justify-center text-center space-y-3 py-16">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center mb-2">
          <Bell size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          No notifications yet
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md font-medium">
          You've got a blank slate (for now). We'll let you know when updates arrive.
        </p>
      </div>

    </div>
  );
}

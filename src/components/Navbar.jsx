import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLogOut, FiBell } = FiIcons;

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Pricing Page Analyzer
          </h1>
          <span className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-full">
            Beta
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Plan: <strong className="capitalize">{user?.plan}</strong></span>
            {user?.scanLimit && (
              <span>• {user?.scanCount}/{user?.scanLimit} scans</span>
            )}
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <SafeIcon icon={FiBell} className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
          </div>

          <button 
            onClick={logout}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
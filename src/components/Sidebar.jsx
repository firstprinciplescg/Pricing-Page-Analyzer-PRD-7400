import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiBarChart3, FiSettings, FiShield, FiGitCompare } = FiIcons;

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/compare', icon: FiGitCompare, label: 'Competitor Compare' },
    { to: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  if (user?.isAdmin) {
    navItems.push({ to: '/admin', icon: FiShield, label: 'Admin' });
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-16 left-0 h-full w-64 bg-white border-r border-gray-200 p-6"
    >
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
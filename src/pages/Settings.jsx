import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiClock, FiCreditCard, FiUser } = FiIcons;

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    scheduleCron: '0 9 * * 1', // Every Monday at 9 AM
    competitorUrl: '',
    emailNotifications: true,
    slackWebhook: ''
  });

  const handleSave = () => {
    // Mock save settings
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your account preferences and automation settings
        </p>
      </motion.div>

      <div className="grid gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Plan
              </label>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium capitalize">
                  {user?.plan}
                </span>
                {user?.plan === 'free' && (
                  <button className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-colors">
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {user?.plan === 'enterprise' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiClock} className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Scheduled Scans</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Cron Expression)
                </label>
                <input
                  type="text"
                  value={settings.scheduleCron}
                  onChange={(e) => setSettings({...settings, scheduleCron: e.target.value})}
                  placeholder="0 9 * * 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Current: Every Monday at 9:00 AM
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Competitor URL
                </label>
                <input
                  type="url"
                  value={settings.competitorUrl}
                  onChange={(e) => setSettings({...settings, competitorUrl: e.target.value})}
                  placeholder="https://competitor.com/pricing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive email alerts for completed scans and issues
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slack Webhook URL
              </label>
              <input
                type="url"
                value={settings.slackWebhook}
                onChange={(e) => setSettings({...settings, slackWebhook: e.target.value})}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
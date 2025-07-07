import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useScan } from '../contexts/ScanContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiLoader } = FiIcons;

const ScanForm = ({ onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { runScan, loading } = useScan();

  const canScan = () => {
    if (!user?.scanLimit) return true;
    return user.scanCount < user.scanLimit;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!canScan()) {
      setError('Scan limit reached. Upgrade to Pro for unlimited scans.');
      return;
    }

    try {
      const result = await runScan(url);
      setUrl('');
      onScanComplete?.(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Analyze Pricing Page
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Pricing Page URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/pricing"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {user?.scanLimit ? (
              <span>
                {user.scanCount}/{user.scanLimit} scans used this month
              </span>
            ) : (
              <span>Unlimited scans available</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !canScan()}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <SafeIcon icon={FiLoader} className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <SafeIcon icon={FiSearch} className="w-4 h-4 mr-2" />
                Analyze Pricing Page
              </>
            )}
          </button>
        </div>
      </form>

      {!canScan() && (
        <div className="mt-4 p-4 bg-gradient-to-r from-accent to-primary rounded-lg">
          <p className="text-white font-medium">Get unlimited scans → Pro</p>
          <p className="text-white text-sm opacity-90 mt-1">
            Upgrade to Pro for $25/month and get unlimited pricing page scans
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ScanForm;
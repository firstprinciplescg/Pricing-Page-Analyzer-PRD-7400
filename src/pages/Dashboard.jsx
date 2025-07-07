import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScan } from '../contexts/ScanContext';
import ScanForm from '../components/ScanForm';
import ScanCard from '../components/ScanCard';
import Toast from '../components/Toast';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiClock, FiCheckCircle } = FiIcons;

const Dashboard = () => {
  const { scans, replayScan } = useScan();
  const [toast, setToast] = useState(null);

  const handleScanComplete = (result) => {
    setToast({
      message: `✅ Grade: ${result.grade}`,
      type: 'success'
    });
  };

  const handleReplay = async (scanId) => {
    try {
      await replayScan(scanId);
      setToast({
        message: 'Scan replayed successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to replay scan',
        type: 'error'
      });
    }
  };

  const stats = [
    {
      label: 'Total Scans',
      value: scans.length,
      icon: FiTrendingUp,
      color: 'text-primary'
    },
    {
      label: 'This Month',
      value: scans.filter(s => {
        const scanDate = new Date(s.timestamp);
        const now = new Date();
        return scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear();
      }).length,
      icon: FiClock,
      color: 'text-accent'
    },
    {
      label: 'Completed',
      value: scans.filter(s => s.status === 'completed').length,
      icon: FiCheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Analyze pricing pages and get instant recommendations to boost conversions
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <SafeIcon icon={stat.icon} className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <ScanForm onScanComplete={handleScanComplete} />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Scans</h2>
        {scans.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No scans yet. Start by analyzing your first pricing page!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} onReplay={handleReplay} />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
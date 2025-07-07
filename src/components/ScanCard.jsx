import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiExternalLink, FiRefreshCw, FiAlertCircle } = FiIcons;

const ScanCard = ({ scan, onReplay }) => {
  const navigate = useNavigate();

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      case 'D': return 'text-red-600 bg-red-100';
      case 'F': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border border-gray-200 p-6 scan-card cursor-pointer"
      onClick={() => navigate(`/scan/${scan.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(scan.grade)}`}>
              Grade {scan.grade}
            </span>
            <span className={`text-sm font-medium ${getStatusColor(scan.status)}`}>
              {scan.status}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {scan.url}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            Scanned {format(new Date(scan.timestamp), 'MMM d, yyyy at h:mm a')}
          </p>
          
          {scan.status === 'completed' && (
            <div className="text-sm text-gray-700">
              Score: <span className="font-semibold">{scan.score}/100</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {scan.status === 'failed' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReplay(scan.id);
              }}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              title="Replay scan"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            </button>
          )}
          
          <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {scan.status === 'failed' && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center space-x-2">
          <SafeIcon icon={FiAlertCircle} className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">Scan failed - click replay to retry</span>
        </div>
      )}
    </motion.div>
  );
};

export default ScanCard;
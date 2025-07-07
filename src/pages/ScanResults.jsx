import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScan } from '../contexts/ScanContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiExternalLink, FiDownload, FiCheckCircle } = FiIcons;

const ScanResults = () => {
  const { id } = useParams();
  const { getScanById } = useScan();
  const [scan, setScan] = useState(null);

  useEffect(() => {
    const foundScan = getScanById(id);
    setScan(foundScan);
  }, [id, getScanById]);

  if (!scan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Scan not found</p>
      </div>
    );
  }

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

  const exportPDF = () => {
    console.log('Exporting PDF for scan:', scan.id);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan Results</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{scan.url}</span>
              <span>•</span>
              <span>{format(new Date(scan.timestamp), 'MMM d, yyyy at h:mm a')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <a
              href={scan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4 mr-2" />
              View Page
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold ${getGradeColor(scan.grade)}`}>
              {scan.grade}
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">Grade {scan.grade}</p>
            <p className="text-gray-600">Overall Score: {scan.score}/100</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Clarity Score</span>
                <span className="font-medium">{scan.metrics?.clarity || 85}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trust Indicators</span>
                <span className="font-medium">{scan.metrics?.trust || 92}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CTA Effectiveness</span>
                <span className="font-medium">{scan.metrics?.cta || 78}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile Optimization</span>
                <span className="font-medium">{scan.metrics?.mobile || 95}/100</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
        <div className="space-y-4">
          {scan.recommendations?.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{recommendation}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Implementing this could improve your conversion rate by 5-15%
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Pricing Structure</h3>
            <p className="text-gray-600">
              Your pricing table is well-structured with clear tier differentiation. 
              Consider highlighting the most popular plan to guide user decisions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Trust Signals</h3>
            <p className="text-gray-600">
              Strong trust indicators present including security badges and customer logos. 
              Adding more specific testimonials could further boost credibility.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Call-to-Action</h3>
            <p className="text-gray-600">
              CTAs are prominent but could benefit from more action-oriented language. 
              Consider A/B testing different button text variations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanResults;
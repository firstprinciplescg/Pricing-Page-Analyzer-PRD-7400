import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiBarChart3, FiUsers, FiZap } = FiIcons;

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <h1 className="text-5xl font-bold mb-6">
            One-Click Pricing Page Analyzer
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get instant A-F grades and actionable recommendations for your pricing pages. 
            Self-serve, rule-based audits that help optimize conversions.
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-8 py-4 bg-white text-accent font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiSearch} className="w-5 h-5 mr-2" />
            Start Free Analysis
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <SafeIcon icon={FiZap} className="w-12 h-12 mb-4 text-yellow-300" />
            <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
            <p>Get A-F grades and recommendations in under 5 seconds</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <SafeIcon icon={FiBarChart3} className="w-12 h-12 mb-4 text-green-300" />
            <h3 className="text-xl font-semibold mb-2">Competitor Compare</h3>
            <p>Side-by-side analysis of your pricing vs competitors</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white">
            <SafeIcon icon={FiUsers} className="w-12 h-12 mb-4 text-blue-300" />
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p>Share reports and insights with your growth team</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
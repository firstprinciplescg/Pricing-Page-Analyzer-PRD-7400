import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiVs } = FiIcons;

const CompetitorCompare = () => {
  const [primaryUrl, setPrimaryUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock comparison
    setTimeout(() => {
      setComparison({
        primary: {
          url: primaryUrl,
          grade: 'A',
          score: 88,
          strengths: ['Clear pricing tiers', 'Strong CTAs', 'Good mobile design'],
          weaknesses: ['Missing testimonials', 'No annual discount shown']
        },
        competitor: {
          url: competitorUrl,
          grade: 'B',
          score: 76,
          strengths: ['Social proof', 'Feature comparison', 'FAQ section'],
          weaknesses: ['Cluttered design', 'Weak CTAs', 'Poor mobile experience']
        }
      });
      setLoading(false);
    }, 2000);
  };

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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitor Compare</h1>
        <p className="text-gray-600">
          Compare your pricing page against competitors to identify opportunities
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Pricing Page
              </label>
              <input
                type="url"
                value={primaryUrl}
                onChange={(e) => setPrimaryUrl(e.target.value)}
                placeholder="https://yoursite.com/pricing"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competitor Pricing Page
              </label>
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="https://competitor.com/pricing"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Comparing...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSearch} className="w-5 h-5 mr-2" />
                  Compare Pages
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Comparison Results
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Your Page</h3>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getGradeColor(comparison.primary.grade)}`}>
                  {comparison.primary.grade}
                </div>
                <p className="text-sm text-gray-600 mt-2">{comparison.primary.url}</p>
                <p className="font-medium">Score: {comparison.primary.score}/100</p>
              </div>

              <div>
                <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {comparison.primary.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {comparison.primary.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Competitor</h3>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getGradeColor(comparison.competitor.grade)}`}>
                  {comparison.competitor.grade}
                </div>
                <p className="text-sm text-gray-600 mt-2">{comparison.competitor.url}</p>
                <p className="font-medium">Score: {comparison.competitor.score}/100</p>
              </div>

              <div>
                <h4 className="font-medium text-green-700 mb-2">Their Strengths</h4>
                <ul className="space-y-1">
                  {comparison.competitor.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2">Their Weaknesses</h4>
                <ul className="space-y-1">
                  {comparison.competitor.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Your page scores higher overall with better mobile optimization</li>
              <li>• Consider adding social proof elements like your competitor</li>
              <li>• Your CTAs are stronger, but competitor's FAQ section adds value</li>
              <li>• Both pages could benefit from clearer annual pricing options</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CompetitorCompare;
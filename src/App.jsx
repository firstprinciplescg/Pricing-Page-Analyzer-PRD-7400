import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ScanResults from './pages/ScanResults';
import CompetitorCompare from './pages/CompetitorCompare';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import { AuthProvider } from './contexts/AuthContext';
import { ScanProvider } from './contexts/ScanContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <Router>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-background"
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/scan/:id" element={<Layout><ScanResults /></Layout>} />
              <Route path="/compare" element={<Layout><CompetitorCompare /></Layout>} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            </Routes>
          </motion.div>
        </Router>
      </ScanProvider>
    </AuthProvider>
  );
}

export default App;
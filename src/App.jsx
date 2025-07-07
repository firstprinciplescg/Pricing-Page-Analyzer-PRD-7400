import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/scan/:id" element={
                <ProtectedRoute>
                  <Layout><ScanResults /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute>
                  <Layout><CompetitorCompare /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout><Settings /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </motion.div>
        </Router>
      </ScanProvider>
    </AuthProvider>
  );
}

export default App;
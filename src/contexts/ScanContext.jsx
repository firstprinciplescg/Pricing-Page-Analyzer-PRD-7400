import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ScanContext = createContext();

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

export const ScanProvider = ({ children }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchScans();
    }
  }, [user]);

  const fetchScans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('scans_pa2024')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scans:', error);
        return;
      }

      setScans(data || []);
    } catch (error) {
      console.error('Error in fetchScans:', error);
    }
  };

  const runScan = async (url) => {
    if (!user) throw new Error('User not authenticated');

    // Check scan limits
    if (user.scanLimit && user.scanCount >= user.scanLimit) {
      throw new Error('Scan limit reached. Upgrade to Pro for unlimited scans.');
    }

    setLoading(true);
    try {
      // Create scan record
      const { data: scanData, error: scanError } = await supabase
        .from('scans_pa2024')
        .insert([
          {
            user_id: user.id,
            url,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (scanError) throw scanError;

      // Mock scan execution with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis results
      const mockResults = {
        grade: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        recommendations: [
          'Add urgency indicators to pricing tiers',
          'Improve call-to-action button visibility',
          'Include customer testimonials',
          'Add feature comparison table',
          'Optimize for mobile viewing'
        ].slice(0, Math.floor(Math.random() * 3) + 2),
        metrics: {
          clarity: Math.floor(Math.random() * 30) + 70,
          trust: Math.floor(Math.random() * 30) + 70,
          cta: Math.floor(Math.random() * 30) + 70,
          mobile: Math.floor(Math.random() * 30) + 70
        }
      };

      // Update scan with results
      const { data: updatedScan, error: updateError } = await supabase
        .from('scans_pa2024')
        .update({
          grade: mockResults.grade,
          score: mockResults.score,
          status: 'completed',
          recommendations: mockResults.recommendations,
          metrics: mockResults.metrics,
          updated_at: new Date().toISOString()
        })
        .eq('id', scanData.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update user's scan count
      await supabase
        .from('profiles_pa2024')
        .update({
          scan_count: user.scanCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      // Refresh scans
      await fetchScans();

      return {
        ...updatedScan,
        timestamp: updatedScan.created_at
      };
    } catch (error) {
      console.error('Error running scan:', error);
      throw new Error('Scan failed - please retry');
    } finally {
      setLoading(false);
    }
  };

  const replayScan = async (scanId) => {
    const scan = scans.find(s => s.id === scanId);
    if (scan) {
      return await runScan(scan.url);
    }
  };

  const getScanById = (id) => {
    return scans.find(s => s.id === id);
  };

  const value = {
    scans: scans.map(scan => ({
      ...scan,
      timestamp: scan.created_at
    })),
    loading,
    runScan,
    replayScan,
    getScanById,
    refreshScans: fetchScans
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};
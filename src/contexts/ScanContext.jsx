import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Mock scan data
    const mockScans = [
      {
        id: '1',
        url: 'https://stripe.com/pricing',
        grade: 'A',
        score: 92,
        timestamp: new Date('2024-01-15T10:30:00Z'),
        status: 'completed',
        recommendations: [
          'Add social proof testimonials',
          'Highlight most popular plan',
          'Include annual discount pricing'
        ]
      },
      {
        id: '2',
        url: 'https://notion.so/pricing',
        grade: 'B',
        score: 78,
        timestamp: new Date('2024-01-14T15:45:00Z'),
        status: 'completed',
        recommendations: [
          'Clarify feature differences',
          'Add FAQ section',
          'Improve CTA visibility'
        ]
      },
      {
        id: '3',
        url: 'https://example.com/pricing',
        grade: 'C',
        score: 65,
        timestamp: new Date('2024-01-13T09:15:00Z'),
        status: 'failed',
        recommendations: []
      }
    ];
    setScans(mockScans);
  }, []);

  const runScan = async (url) => {
    setLoading(true);
    try {
      // Mock scan execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newScan = {
        id: Date.now().toString(),
        url,
        grade: 'A',
        score: 88,
        timestamp: new Date(),
        status: 'completed',
        recommendations: [
          'Add urgency indicators',
          'Improve pricing table layout',
          'Include enterprise contact option'
        ]
      };

      setScans(prev => [newScan, ...prev]);
      return newScan;
    } catch (error) {
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

  const value = {
    scans,
    loading,
    runScan,
    replayScan
  };

  return (
    <ScanContext.Provider value={value}>
      {children}
    </ScanContext.Provider>
  );
};
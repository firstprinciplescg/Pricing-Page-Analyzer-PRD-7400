import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APP_CONFIG, getPlanConfig } from '../config/constants';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiClock, FiAlertCircle, FiRefreshCw, FiDownload, FiEdit, FiTrash2, FiCheck, FiX } = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchScans();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles_pa2024')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScans = async () => {
    try {
      const { data, error } = await supabase
        .from('scans_pa2024')
        .select(`
          *,
          profiles_pa2024!inner(email, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const updateUserPlan = async (userId, newPlan) => {
    try {
      const planConfig = getPlanConfig(newPlan);
      const { error } = await supabase
        .from('profiles_pa2024')
        .update({
          plan: newPlan,
          scan_limit: planConfig.scanLimit,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user plan:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete user's scans
      await supabase
        .from('scans_pa2024')
        .delete()
        .eq('user_id', userId);

      // Then delete user profile
      const { error } = await supabase
        .from('profiles_pa2024')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const replayFailedScans = async () => {
    console.log('Replaying failed scans...');
    // Implementation for replaying failed scans
  };

  const exportLogs = () => {
    const csvContent = users.map(user => 
      `${user.email},${user.name},${user.plan},${user.scan_count},${user.created_at}`
    ).join('\n');
    
    const blob = new Blob([`Email,Name,Plan,Scan Count,Created At\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const failedScans = scans.filter(scan => scan.status === 'failed');
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.scan_count > 0).length,
    totalScans: scans.length,
    failedScans: failedScans.length
  };

  const tabs = [
    { id: 'users', label: 'Users & Plans', icon: FiUsers },
    { id: 'scans', label: 'All Scans', icon: FiClock },
    { id: 'failed', label: 'Failed Jobs', icon: FiAlertCircle }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage users, monitor scans, and handle system administration
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <SafeIcon icon={FiUsers} className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
            </div>
            <SafeIcon icon={FiClock} className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Scans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failedScans}</p>
            </div>
            <SafeIcon icon={FiAlertCircle} className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={exportLogs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scans Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser === user.id ? (
                            <select
                              value={user.plan}
                              onChange={(e) => updateUserPlan(user.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="free">Free</option>
                              <option value="pro">Pro</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          ) : (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                              user.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.plan}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.scan_count || 0}
                          {user.scan_limit && ` / ${user.scan_limit}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {editingUser === user.id ? (
                              <>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <SafeIcon icon={FiCheck} className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <SafeIcon icon={FiX} className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingUser(user.id)}
                                  className="text-primary hover:text-primary-dark"
                                >
                                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                                </button>
                                {user.email !== currentUser?.email && (
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'scans' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-gray-900">All Scans</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scans.map((scan) => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a href={scan.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                            {scan.url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.profiles_pa2024?.name || scan.profiles_pa2024?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {scan.grade && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              scan.grade === 'A' ? 'bg-green-100 text-green-800' :
                              scan.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {scan.grade}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                            scan.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {scan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Failed Jobs</h2>
                <button
                  onClick={replayFailedScans}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                  Replay Failed Scans
                </button>
              </div>

              {failedScans.length === 0 ? (
                <div className="text-center py-8">
                  <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No failed scans to display</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Failed At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {failedScans.map((scan) => (
                        <tr key={scan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {scan.url}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {scan.profiles_pa2024?.name || scan.profiles_pa2024?.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(scan.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-accent hover:text-accent-dark">
                              Replay
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
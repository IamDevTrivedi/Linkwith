import React, { useEffect, useContext, useState } from 'react';
import { BarChart2, Users, Link } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';
import { Link as LINK } from 'react-router-dom';

export default function Dashboard() {
  const [overviewData, setOverviewData] = useState({ totalShortUrls: 0, totalRedirects: 0, topUrls: [] });
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { FRONTEND_URL, userData, getDashboardData } = useContext(AppContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!userData) {
          toast.error('Please sign in to view the dashboard', TOAST_CONFIG);
          navigate('/signin');
          return;
        }

        if (userData.isAccountVerified === false) {
          toast.error('Please verify your email to view the dashboard', TOAST_CONFIG);
          navigate('/verify-email');
          return;
        }

        setIsLoading(true);
        const data = await getDashboardData();

        if (data.success) {
          setOverviewData(data.overviewData);
          setTableData(data.tableData);
        } else {
          toast.error(data.error || 'Failed to fetch dashboard data', TOAST_CONFIG);
        }
      } catch (error) {
        toast.error(error.message || 'Something went wrong', TOAST_CONFIG);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData, navigate, getDashboardData]);

  document.title = `Dashboard ${userData ? `| ${userData.name}` : null} | Linkwith | Create Custom Short URLs with Ease`;

  if (isLoading) {
    return (
      <div className="min-h-screen from-gray-900 to-black bg-gradient-to-b text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black  text-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <LINK to="/edit-profile" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Users size={20} />
          Edit Profile
        </LINK>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total URLs Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Short URLs</p>
              <h3 className="text-2xl font-bold mt-1">{overviewData.totalShortUrls}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Link className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        {/* Total Redirects Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Redirects</p>
              <h3 className="text-2xl font-bold mt-1">{overviewData.totalRedirects}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart2 className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Top URLs Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors duration-200">
          <p className="text-gray-400 text-sm mb-4">Top Performing URLs</p>
          {overviewData.topUrls.map((url, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-sm truncate">{`${FRONTEND_URL}/s/${url.shortURL}`}</span>
              <span className="text-green-400 text-sm">{url.clicks} clicks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Detailed View</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Short URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Original URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tableData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`${FRONTEND_URL}/s/${data.shortURL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {`${FRONTEND_URL}/s/${data.shortURL}`}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {data.title ? (
                      <span className="text-gray-100">{data.title}</span>
                    ) : (
                      <span className="text-gray-500 italic">No title</span>
                    )}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs">{data.longURL}</td>
                  <td className="px-6 py-4">
                    {new Date(data.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <LINK to={`/analytics/${data.shortURL}`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
                      <BarChart2 size={16} />
                      Analytics
                    </LINK>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
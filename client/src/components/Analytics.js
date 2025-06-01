import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import Spinner from './Spinner';
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import TOAST_CONFIG from '../config/toast.config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-xl border border-red-500/50 max-w-md w-full">
      <div className="flex items-center gap-4 mb-4">
        <AlertTriangle className="text-red-500 w-8 h-8" />
        <h2 className="text-xl font-semibold text-red-500">Error</h2>
      </div>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

export default function Analytics() {
  const { shortURL } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { userData, getShortURLData } = useContext(AppContext);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (!userData) {
          throw new Error("You need to login to view analytics");
        }

        const response = await getShortURLData(shortURL);
        if (!response) {
          throw new Error("Short URL not found");
        }
        setData(response.data);

      } catch (err) {
        setError(err.message);
        toast.error(err.message, TOAST_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [shortURL, userData, getShortURLData]);

  if (loading) return <Spinner size='large' />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return <ErrorDisplay message="No data available" />;

  const renderChart = (title, chart) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer>
          {chart}
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen from-gray-900 to-black bg-gradient-to-b text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Analytics for {data.title}
          </h1>
          <div className="space-y-2 mt-4">
            <p className="text-gray-400">Short URL: <span className="text-gray-200">{data.shortURL}</span></p>
            <p className="text-gray-400">Created At: <span className="text-gray-200">{new Date(data.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {renderChart("Total vs Unique Clicks",
            <BarChart data={[data.clicks]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#000000', border: 'none' }} />
              <Bar dataKey="total" name="Total Clicks" fill="#0088FE" />
              <Bar dataKey="unique" name="Unique Clicks" fill="#00C49F" />
            </BarChart>
          )}

          {renderChart("Device Distribution",
            <PieChart>
              <Pie
                data={Object.entries(data.analytics.devices).map(([name, value]) => ({ name, value }))}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={100}
                paddingAngle={5} dataKey="value"
                label
              >
                {Object.entries(data.analytics.devices).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#FCA01E', border: 'none' }} />
              <Legend />
            </PieChart>
          )}

        </div>

        <div className="mb-8">
          {renderChart("Daily Click Trends",
            <LineChart data={data.analytics.dailyClicks} height={400}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#000000', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="totalClicks" stroke="#0088FE" name="Total Clicks" />
              <Line type="monotone" dataKey="uniqueClicks" stroke="#00C49F" name="Unique Clicks" />
            </LineChart>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderChart("Browser Distribution",
            <BarChart data={Object.entries(data.analytics.browsers).map(([name, value]) => ({ name, value }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#000000', border: 'none' }} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          )}

          {renderChart("Geographic Distribution",
            <BarChart data={data.analytics.geography}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="country" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#000000', border: 'none' }} />
              <Bar dataKey="clicks" fill="#00C49F" />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  );
}
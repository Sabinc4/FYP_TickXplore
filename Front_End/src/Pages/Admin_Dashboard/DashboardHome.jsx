import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useOutletContext } from 'react-router-dom';

const DashboardHome = () => {
  const { dashboardData, loading, error } = useOutletContext();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter out Admins if present
  const filteredData = dashboardData.filter(item => item.name.toLowerCase() !== 'admins');

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
        {filteredData.map((item) => (
          <div
            key={item.name}
            className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm hover:shadow-md transition-all"
            style={{ borderLeft: `4px solid ${item.color}` }}
          >
            <h3 className="text-sm md:text-lg font-semibold text-gray-700">
              {item.name}
            </h3>
            <p 
              className="text-2xl md:text-3xl font-bold mt-1 md:mt-2" 
              style={{ color: item.color }}
            >
              {item.count}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Entity Distribution</h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                name="Total Count"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

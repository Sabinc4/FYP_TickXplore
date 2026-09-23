import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useOutletContext } from "react-router-dom";

interface DashboardItem {
  name: string;
  count: number;
  color: string;
}

interface OutletContext {
  dashboardData: DashboardItem[];
  loading: boolean;
  error: string;
}

const DashboardHome = () => {
  const { dashboardData, loading, error } = useOutletContext<OutletContext>();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter out Admins if present
  const filteredData = dashboardData.filter(
    (item) => item.name.toLowerCase() !== "admins"
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
        {filteredData.map((item) => (
          <div
            key={item.name}
            className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md md:rounded-xl md:p-6"
            style={{ borderLeft: `4px solid ${item.color}` }}
          >
            <h3 className="text-sm font-semibold text-gray-700 md:text-lg">
              {item.name}
            </h3>
            <p
              className="mt-1 text-2xl font-bold md:mt-2 md:text-3xl"
              style={{ color: item.color }}
            >
              {item.count}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm md:rounded-xl md:p-6">
        <h2 className="mb-3 font-semibold md:mb-4 md:text-xl">
          Entity Distribution
        </h2>
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
                fill="#6366F1"
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
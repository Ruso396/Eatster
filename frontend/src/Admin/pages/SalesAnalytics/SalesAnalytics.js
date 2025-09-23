// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import axios from 'axios';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const SalesAnalytics = () => {
//   const [weeklySales, setWeeklySales] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🧠 Utility to get week number from a date
//   const getWeekNumber = (date) => {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     d.setDate(d.getDate() + 4 - (d.getDay() || 7)); // Thursday = 4
//     const yearStart = new Date(d.getFullYear(), 0, 1);
//     const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
//     return `${d.getFullYear()}-W${weekNo}`;
//   };

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('https://eatster-pro.onrender.com/api/orders/restaurant', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const groupedData = {};

//         res.data.forEach((order) => {
//           if (order.order_status.toLowerCase() === 'delivered') {
//             const week = getWeekNumber(order.order_date_time);
//             if (!groupedData[week]) {
//               groupedData[week] = { revenue: 0, orders: 0 };
//             }
//             groupedData[week].revenue += parseFloat(order.total_price);
//             groupedData[week].orders += 1;
//           }
//         });

//         const weeklyData = Object.entries(groupedData).map(([period, data]) => ({
//           period,
//           revenue: data.revenue.toFixed(2),
//           orders: data.orders,
//         }));

//         setWeeklySales(weeklyData);
//       } catch (err) {
//         console.error("Error fetching sales analytics", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // 📊 Prepare Chart.js data
//   const chartData = {
//     labels: weeklySales.map(d => d.period),
//     datasets: [
//       {
//         label: 'Revenue (₹)',
//         data: weeklySales.map(d => d.revenue),
//         backgroundColor: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500
//         borderRadius: 6,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },
//       tooltip: { callbacks: {
//         label: (context) => `₹${context.raw}`,
//       }},
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: (value) => `₹${value}`,
//         },
//       },
//     },
//   };

//   return (
//     <section className="bg-white p-6 rounded-xl shadow-md">
//       <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Sales Analytics</h3>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading analytics...</p>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             {weeklySales.map((data) => (
//               <div key={data.period} className="bg-blue-50 p-5 rounded-lg shadow-sm text-center">
//                 <p className="text-sm text-blue-700 font-medium">{data.period}</p>
//                 <p className="text-3xl font-bold text-blue-800 my-2">₹{data.revenue}</p>
//                 <p className="text-sm text-blue-600">{data.orders} Orders</p>
//               </div>
//             ))}
//           </div>

//           {/* Sales Chart */}
//           <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//         </>
//       )}
//     </section>
//   );
// };

// export default SalesAnalytics;
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChart } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesAnalytics = () => {
  const [weeklySales, setWeeklySales] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://eatster-pro.onrender.com/api/orders/restaurant', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const groupedData = {};

        res.data.forEach((order) => {
          if (order.order_status.toLowerCase() === 'delivered') {
            const week = getWeekNumber(order.order_date_time);
            if (!groupedData[week]) {
              groupedData[week] = { revenue: 0, orders: 0 };
            }
            groupedData[week].revenue += parseFloat(order.total_price);
            groupedData[week].orders += 1;
          }
        });

        const weeklyData = Object.entries(groupedData).map(([period, data]) => ({
          period,
          revenue: data.revenue.toFixed(2),
          orders: data.orders,
        }));

        setWeeklySales(weeklyData);
      } catch (err) {
        console.error("Error fetching sales analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔸 Gradient for Chart Bars
  const getGradient = (ctx) => {
    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#fb923c'); // orange-400
    gradient.addColorStop(1, '#f97316'); // orange-500
    return gradient;
  };

  // 📊 Chart Data
  const chartData = {
    labels: weeklySales.map(d => d.period),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: weeklySales.map(d => d.revenue),
        backgroundColor: (ctx) => getGradient(ctx),
        borderRadius: 10,
        barThickness: 40,
        borderSkipped: false,
      },
    ],
  };

  // ⚙️ Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#fcd34d',
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: (context) => `₹${context.raw}`,
        },
      },
    },
    layout: {
      padding: { top: 20, bottom: 10, left: 10, right: 10 },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `₹${value}`,
          font: { size: 13 },
          color: '#4b5563',
        },
      },
    },
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart className="text-orange-500 w-6 h-6" />
        Weekly Sales Analytics
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading analytics...</p>
      ) : (
        <>
          {/* 🔶 Weekly Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {weeklySales.map((data) => (
              <div
                key={data.period}
                className="bg-gradient-to-br from-orange-100 to-orange-200 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <p className="text-sm text-orange-700 font-medium uppercase tracking-wider">
                  {data.period}
                </p>
                <p className="text-3xl font-extrabold text-orange-900 my-2">₹{data.revenue}</p>
                <p className="text-sm text-orange-600">{data.orders} Orders</p>
              </div>
            ))}
          </div>

          {/* 📈 Gradient Bar Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-inner h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </section>
  );
};

export default SalesAnalytics;

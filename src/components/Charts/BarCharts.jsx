import React from 'react';
import { Bar } from 'react-chartjs-2';
import { format, addDays, isWithinInterval } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, selectedDate, isAllWeek=false }) => {
  // Calculate the end date, 7 days from selectedDate
  const endDate = addDays(new Date(selectedDate), 7);

  // Filter the data to only include entries within the 7-day range
  const filteredData = isAllWeek ? data: data.filter((entry) =>
    isWithinInterval(new Date(entry.date), {
      start: new Date(selectedDate),
      end: endDate,
    })
  );

  // console.log(data, " ==== nsacjsancjsj, ", filteredData);
  

  // Prepare chart data
  const chartData = {
    labels: filteredData.map((entry) => format(new Date(entry.date), 'yyyy-MM-dd')),
    datasets: [
      {
        label: 'My Hours',
        data: filteredData.map((entry) => entry.time),
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Light blue color
        borderColor: 'rgba(54, 162, 235, 1)', // Darker blue for borders
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'My Hours',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
















// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register components for Chart.js
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const BarChart = ({ data }) => {
//   const chartData = {
//     labels: data.labels,
//     datasets: [
//       {
//         label: 'My Hours',
//         data: data.values,
//         backgroundColor: 'rgba(54, 162, 235, 0.5)', // Light blue color
//         borderColor: 'rgba(54, 162, 235, 1)', // Darker blue for borders
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           display: false,
//         },
//         title: {
//           display: true,
//           text: 'My Hours',
//         },
//       },
//     },
//   };

//   return <Bar data={chartData} options={options} />;
// };

// export default BarChart;
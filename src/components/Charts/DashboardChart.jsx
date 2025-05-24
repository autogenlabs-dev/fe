import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart = ({ projects = [] }) => {
  // Define labels for the days of the month (1-30)
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  // Calculate data based on project fields. For example, summarizing total_fee, labour_budget, and expense_variance per day
  const totalFeeData = new Array(30).fill(0);
  const labourBudgetData = new Array(30).fill(0);
  const expenseVarianceData = new Array(30).fill(0);

  // Populate data for the current month by mapping the project dates
  projects.forEach(project => {
    const projectStartDate = new Date(project.start_date).getDate() - 1; // Adjust for 0-indexed arrays
    if (projectStartDate < 30) {
      totalFeeData[projectStartDate] += project.total_fee || 0;
      labourBudgetData[projectStartDate] += project.labour_budget || 0;
      expenseVarianceData[projectStartDate] += project.expense_varience || 0;
    }
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Fee',
        data: totalFeeData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Labour Budget',
        data: labourBudgetData,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expense Budget',
        data: expenseVarianceData,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Comparison of Total Fee, Labour Budget, and Expense Variance',
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
          display: true,
        },
        ticks: {
          stepSize: 1000,
        },
      },
    },
  };

  return (
    <div className='w-full md:w-[48%]' style={{ height: '400px', border: '1px solid #7393B3', borderRadius: '8px', padding: '10px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DashboardChart;





















// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the necessary components in Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const DashboardChart = ({ projects = [] }) => {
//   // Define labels for the days (you can modify this based on the actual date range)
//   const labels = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Today'];

//   // Calculate data based on project fields, for example:
//   const totalFeeData = projects.map(project => project.total_fee || 0);
//   const labourBudgetData = projects.map(project => project.labour_budget || 0);
//   const expenseVarianceData = projects.map(project => project.expense_varience || 0);

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Total Fee',
//         data: totalFeeData,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Labour Budget',
//         data: labourBudgetData,
//         backgroundColor: 'rgba(153, 102, 255, 0.6)',
//         borderColor: 'rgba(153, 102, 255, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Expense Variance',
//         data: expenseVarianceData,
//         backgroundColor: 'rgba(255, 159, 64, 0.6)',
//         borderColor: 'rgba(255, 159, 64, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Comparison of Total Fee, Labour Budget, and Expense Variance',
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
//           display: true,
//         },
//         ticks: {
//           stepSize: 1000,
//         },
//       },
//     },
//   };

//   return (
//     <div className='w-full md:w-[48%]' style={{ height: '400px', border: '1px solid #7393B3', borderRadius: '8px', padding: '10px' }}>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default DashboardChart;





















// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the necessary components in Chart.js
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const DashboardChart = ({ projects=[] }) => {
//   const labels = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Today'];

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Billable Amount',
//         data: [0, 20, 20, 10, 30, 50, 40],
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Billable Hours',
//         data: [0, 10, 10, 10, 30, 20, 30],
//         backgroundColor: 'rgba(153, 102, 255, 0.6)',
//         borderColor: 'rgba(153, 102, 255, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Labor Hours',
//         data: [0, 20, 30, 40, 60, 40, 80],
//         backgroundColor: 'rgba(255, 159, 64, 0.6)',
//         borderColor: 'rgba(255, 159, 64, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Comparison of Billable and Labor Hours',
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false, // Hide grid lines on the x-axis
//         },
//       },
//       y: {
//         beginAtZero: true,
//         grid: {
//           display: true,
//         },
//         ticks: {
//           stepSize: 20, // Customize step size for y-axis
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ width: '48%', height: '400px', border: '1px solid #7393B3', borderRadius: '8px', padding: '10px' }}>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default DashboardChart;
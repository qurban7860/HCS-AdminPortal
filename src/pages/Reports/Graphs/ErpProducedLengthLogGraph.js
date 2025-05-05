import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton } from '@mui/material';
import LogChartStacked from '../../../components/machineLogs/LogStackedChart';

const ErpProducedLengthLogGraph = ({ timePeriod, customer, graphLabels }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);
  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedDataToMeters = machineLogsGraphData.map(item => ({
        ...item,
        componentLength: item.componentLength / 1000,
        waste: item.waste / 1000
      }));
      setGraphData(convertedDataToMeters);
    }
  }, [machineLogsGraphData]);

  const processGraphData = () => {
    if (!graphData || graphData.length === 0) {
      return null;
    }

    const sortedData = [...graphData].sort((a, b) => a._id.localeCompare(b._id));
    let labels = sortedData.map(item => item._id);

    switch (timePeriod) {
      case 'Hourly':
        sortedData.sort((a, b) => new Date(a._id) - new Date(b._id));
        labels = Array.from({ length: 24 }, (_, i) => {
          const date = new Date();
          date.setHours(date.getHours() - i);
          const hour = String(date.getHours()).padStart(2, '0');
          return `${hour}:00`;
        }).reverse();                   
        break;
      case 'Daily':
        sortedData.sort((a, b) => new Date(a._id) - new Date(b._id));
        labels = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          return `${day}/${month}`;
        }).reverse();
        break;
        case 'Monthly':
          sortedData.sort((a, b) => new Date(a._id) - new Date(b._id));        
          labels = Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return date.toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit'
            });
          }).reverse();          
        break;
      case 'Quarterly':
        sortedData.sort((a, b) => {
          const [yearA, qtrA] = a._id.split('-');
          const [yearB, qtrB] = b._id.split('-');
          return yearA === yearB ? qtrA.localeCompare(qtrB) : yearA.localeCompare(yearB);
        });
        labels = Array.from({ length: 4 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i * 3);
          const year = date.getFullYear();
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `${year}-Q${quarter}`;
        }).reverse();
        break;
      case 'Yearly':
        sortedData.sort((a, b) => a._id.localeCompare(b._id));
        labels = Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setFullYear(date.getFullYear() - i);
          return date.getFullYear().toString();
        }).reverse();
        break;
      default:
        labels = sortedData.map((item) => item._id);
    }

    const producedLength = labels.map(label => {
      const dataPoint = sortedData.find(item => item._id.includes(label));
      return dataPoint ? dataPoint.componentLength : 0;
    });
    const wasteLength = labels.map(label => {
      const dataPoint = sortedData.find(item => item._id.includes(label));
      return dataPoint ? dataPoint.waste : 0;
    });

    return {
      categories: labels,
      series: [
        { name: 'Produced Length (m)', data: producedLength },
        { name: 'Waste Length (m)', data: wasteLength },
      ],
    };
  };

  const chartData = processGraphData();

  const getDataRangeText = () => {
    switch (timePeriod) {
      case 'Hourly':
        return 'last 24 Hours';
      case 'Daily':
        return 'last 30 Days';
      case 'Monthly':
        return 'last 12 Months';
      case 'Quarterly':
        return 'last 4 Quarters';
      case 'Yearly':
        return 'last 5 Years';
      default:
        return '';
    }
  }

  return (
    <Grid item xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Produced Length & Waste Over Time (For the {getDataRangeText()})
        </Typography>

        {isLoading && <Skeleton variant="rectangular" width="100%" height={120} />}
        {!isLoading && (
          <>
            {graphData?.length > 0 && (
              <>
                {chartData && <LogChartStacked chart={chartData} graphLabels={graphLabels} />}
              </>
            )}
            {graphData?.length === 0 && (
              <Typography variant="body1" color="textSecondary">
                {customer?._id ? `No data available for the ${getDataRangeText()}.` : "Please Select a customer to view the graph."}
              </Typography>
            )}
          </>
        )}
      </Card>
    </Grid>
  );
};

export default ErpProducedLengthLogGraph;
ErpProducedLengthLogGraph.propTypes = {
  timePeriod: PropTypes.oneOf(['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']).isRequired,
  customer: PropTypes.object,
  graphLabels: PropTypes.object,
};

// import PropTypes from 'prop-types';
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Typography, Card, Grid, Skeleton } from '@mui/material';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// const formatNumber = (num) => {
//   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//   if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
//   return num.toFixed(1);
// };

// const barTotalPlugin = {
//   id: 'barTotal',
//   afterDatasetsDraw: (chart, args, options) => {
//     const { ctx, data } = chart;
//     ctx.save();
//     ctx.font = '11px Arial';
//     ctx.fillStyle = '#616161';
//     ctx.textAlign = 'center';

//     data.datasets.forEach((dataset, datasetIndex) => {
//       const meta = chart.getDatasetMeta(datasetIndex);
//       meta.data.forEach((bar, index) => {
//         const value = dataset.data[index];
//         const formattedValue = formatNumber(value);
//         ctx.fillText(formattedValue, bar.x, bar.y - 5);
//       });
//     });
//     ctx.restore();
//   }
// };

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, barTotalPlugin);

// const ErpProducedLengthLogGraph = ({timePeriod, customer}) => {
//   const [graphData, setGraphData] = useState([]);
//   const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

//   useEffect(() => {
//     if (machineLogsGraphData) {
//       const convertedDataToMeters = machineLogsGraphData.map(item => ({
//         ...item,
//         componentLength: item.componentLength / 1000,
//         waste: item.waste / 1000
//       }));
//       setGraphData(convertedDataToMeters);
//     }
//   }, [machineLogsGraphData]);


//   const processGraphData = () => {
//     if (!graphData || graphData.length === 0) {
//       return null;
//     }

//     const sortedData = [...graphData].sort((a, b) => a._id.localeCompare(b._id));

//     const labels = sortedData.map(item => item._id);
//     const producedLength = sortedData.map(item => item.componentLength);
//     const wasteLength = sortedData.map(item => item.waste);

//     return {
//       labels,
//       datasets: [
//         { label: 'Produced Length (m)', data: producedLength, backgroundColor: '#A9E0FC' },
//         { label: 'Waste Length (m)', data: wasteLength, backgroundColor: '#FCB49F' },
//       ],
//     };
//   };

//   const chartData = processGraphData();

//   const getDataRangeText = () => {
//     switch (timePeriod) {
//       case 'Daily':
//         return 'last 7 Days';
//       case 'Monthly':
//         return 'last 12 Months';
//       case 'Quarterly':
//         return 'last 4 Quarters';
//       case 'Yearly':
//         return 'last 5 Years';
//       default:
//         return '';
//     }
//   }

//   return (
//     <Grid xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3}}>
//       <Card sx={{ p: 4, boxShadow: 3 }}>
//         <Typography variant="h6" color="primary" gutterBottom>
//           Produced Length & Waste Over Time (For the {getDataRangeText()})
//         </Typography>

//         {isLoading && <Skeleton variant="rectangular" width="100%" height={120} />}
//         {!isLoading && chartData ? (
//           <div style={{ maxWidth: '100vh', margin: '0 auto' }}>
//             <Bar
//               data={chartData}
//               options={{
//                 responsive: true,
//                 maintainAspectRatio: true,
//                 aspectRatio: 1.5,
//                 elements: {
//                   bar: {
//                     borderRadius: 3,
//                   },
//                 },
//                 scales: {
//                   y: {
//                     beginAtZero: true,
//                     title: {
//                       display: true,
//                       text: 'Meters',
//                       font: { size: 14, weight: 'bold' },
//                       color: '#616161',
//                     },
//                     ticks: {
//                       callback(value) {
//                         return formatNumber(value);
//                       },
//                     },
//                   },
//                   x: {
//                     title: {
//                       display: true,
//                       text: 'Time Period',
//                       font: { size: 14, weight: 'bold' },
//                       color: '#616161',
//                     },
//                   },
//                 },
//                 plugins: {
//                   legend: {
//                     display: true,
//                     position: 'top',
//                     labels: { font: { size: 14 }, color: '#424242' },
//                   },
//                   title: {
//                     display: true,
//                     text: 'Produced & Waste Length (m)',
//                     font: { size: 18, weight: 'bold' },
//                   },
//                   barTotal: {},
//                   tooltip: {
//                     backgroundColor: '#FFFFFFE6',
//                     titleColor: 'black',
//                     bodyColor: 'black',
//                     borderColor: '#6b7280',
//                     borderWidth: 0.5,
//                     padding: 10,
//                     displayColors: true,
//                   },
//                 },
//               }}
//             />
//           </div>
//         ) : (
//           <Typography variant="body1" color="textSecondary">
//             {customer?._id ? `No data available for the ${getDataRangeText()}.` : "Please Select a customer to view the graph."}
//           </Typography>
//         )}
//       </Card>
//     </Grid>
//   );
// };

// export default ErpProducedLengthLogGraph;
// ErpProducedLengthLogGraph.propTypes = {
//   timePeriod: PropTypes.string,
//   customer: PropTypes.object,
// };
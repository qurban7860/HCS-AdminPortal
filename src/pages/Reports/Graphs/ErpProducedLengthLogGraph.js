/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Box, Skeleton } from '@mui/material';
import LogChartStacked from '../../../components/machineLogs/LogStackedChart';
import { TableNoData } from '../../../components/table';

const ErpProducedLengthLogGraph = ({ timePeriod, customer, graphLabels, dateFrom, dateTo }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedDataToMeters = machineLogsGraphData.map((item) => ({
        ...item,
        componentLength: item.componentLength / 1000,
        waste: item.waste / 1000,
        _id: timePeriod === 'Monthly' ? item._id.replace(/^Sep /, 'Sept ') : item._id,
      }));
      setGraphData(convertedDataToMeters);
    }
  }, [machineLogsGraphData, timePeriod]);
  
  const getTotalProduction = () => {
    if (!graphData || graphData.length === 0) return '0';
    const totalProduced = graphData.reduce(
      (sum, item) => sum + (item.componentLength || 0) + (item.waste || 0),
      0
    );
    return totalProduced.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  };

  const processGraphData = (skipZeroValues) => {
    if (!graphData || graphData.length === 0) return null;

    const dataMap = new Map();
    graphData.forEach((item) => dataMap.set(item._id, item));

    const labels = [];
    const current = new Date(dateFrom);
    const end = new Date(dateTo);
    const pad = (n) => n.toString().padStart(2, '0');

    const addLabel = (label) => {
      if (!labels.includes(label)) labels.push(label);
    };

    switch (timePeriod) {
      case 'Hourly':
        current.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); 

        while (current <= end) {
          const label = `${pad(current.getMonth() + 1)}/${pad(current.getDate())} ${pad(current.getHours())}`;
          if (dataMap.has(label) || !skipZeroValues) addLabel(label);
          current.setHours(current.getHours() + 1);
        }
        break;

      case 'Daily':
        current.setHours(0, 0, 0, 0); 
        end.setHours(23, 59, 59, 999); 

        while (current <= end) {
          const label = `${pad(current.getDate())}/${pad(current.getMonth() + 1)}`;
          if (dataMap.has(label) || !skipZeroValues) addLabel(label);
          current.setDate(current.getDate() + 1);
        }
        break;

      case 'Monthly':
        {
          current.setDate(1); 
          const tempEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0); 

          while (current <= tempEnd) {
            const label = `${current.toLocaleString('default', { month: 'short' })} ${String(current.getFullYear()).slice(-2)}`;
            if (dataMap.has(label) || !skipZeroValues) addLabel(label);
            current.setMonth(current.getMonth() + 1);
          }
        }
        break;

      case 'Quarterly':
        current.setMonth(Math.floor(current.getMonth() / 3) * 3, 1);
        current.setHours(0, 0, 0, 0);

        while (current <= end) {
          const year = current.getFullYear();
          const quarter = Math.floor(current.getMonth() / 3) + 1;
          const label = `${year}-Q${quarter}`;
          if (dataMap.has(label) || !skipZeroValues) addLabel(label);
          current.setMonth(current.getMonth() + 3);
        }
        break;

      case 'Yearly':
        current.setMonth(0, 1); 
        current.setHours(0, 0, 0, 0);

        while (current <= end) {
          const label = `${current.getFullYear()}`;
          if (dataMap.has(label) || !skipZeroValues) addLabel(label);
          current.setFullYear(current.getFullYear() + 1);
        }
        break;

      default:
        return null;
    }
   
    const producedLength = labels.map((label) => dataMap.get(label)?.componentLength || 0);
    const wasteLength = labels.map((label) => dataMap.get(label)?.waste || 0);

    return {
      categories: labels,
      series: [
        { name: 'Produced Length (m)', data: producedLength },
        { name: 'Waste Length (m)', data: wasteLength },
      ],
    };
  };
  
  const isNotFound = !isLoading && !graphData.length;

  return (
    <Grid item xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Meterage Production
          </Typography>

          <Typography variant="subtitle1" > 
            <strong>Meterage Production:</strong> {getTotalProduction()} m {' '}
              <span style={{ color: '#666' }}>
                ({dateFrom.toLocaleDateString('en-GB')} – {dateTo.toLocaleDateString('en-GB')})
              </span>
          </Typography>
        </Box>

        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            {graphData?.length > 0 ? (
              <LogChartStacked processGraphData={processGraphData} graphLabels={graphLabels} isLoading={isLoading} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }} >
                <TableNoData isNotFound={isNotFound} />
              </Box>
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
  dateFrom: PropTypes.instanceOf(Date),
  dateTo: PropTypes.instanceOf(Date),
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

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

  const parseHourlyDate = (id, baseYear) => {
    try {
      const [monthDay, hourStr] = id.split(' ');
      if (!monthDay || !hourStr) return null;

      const [month, day] = monthDay.split('/');
      if (!month || !day) return null;

      const hour = parseInt(hourStr, 10);
      if (Number.isNaN(hour)) return null;

      return new Date(`${baseYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00`);
    } catch (error) {
      console.warn('Invalid _id format for hourly data:', id);
      return null;
    }
  };

  const getEarliestDateFromGraphData = () => {
    if (graphData.length === 0) return new Date(dateFrom); 

    let minDate = new Date(dateTo); 

    graphData.forEach((item) => {
      let itemDate;
      if (timePeriod === 'Hourly') {
        itemDate = parseHourlyDate(item._id, dateFrom.getFullYear());
      } else if (timePeriod === 'Daily') {
        const [day, month] = item._id.split('/');
        itemDate = new Date(`${dateFrom.getFullYear()}-${month}-${day}`);
      } else if (timePeriod === 'Monthly') {
        itemDate = new Date(item._id.replace(/(\w+)\s(\d+)/, (_, m, y) => `${m} 1, 20${y}`));
      } else if (timePeriod === 'Quarterly') {
        const [year, quarterStr] = item._id.split('-Q');
        const month = (parseInt(quarterStr, 10) - 1) * 3;
        itemDate = new Date(parseInt(year, 10), month);
      } else if (timePeriod === 'Yearly') {
        itemDate = new Date(parseInt(item._id, 10), 0);
      } else {
        itemDate = new Date(dateFrom);
      }
      if (itemDate && !Number.isNaN(itemDate) && itemDate < minDate) {
        minDate = itemDate;
      }
    });

    return minDate;
  };

  const processGraphData = (skipZeroValues) => {
    if (!graphData || graphData.length === 0) return null;

    const dataMap = new Map();
    graphData.forEach((item) => dataMap.set(item._id, item));

    const labels = [];
    let startDate = new Date(dateFrom);
    const effectiveEndDate = new Date(dateTo);

    if (!skipZeroValues && graphData.length > 0) {
      startDate = getEarliestDateFromGraphData();
    }

    const addLabel = (label) => {
      if (!labels.includes(label)) labels.push(label);
    };

    if (timePeriod === 'Hourly') {
      const current = new Date(startDate);
      effectiveEndDate.setHours(23, 59, 59, 999);
      let count = 0;
      while (current <= effectiveEndDate && count < 24) {
        const label = `${(current.getMonth() + 1).toString().padStart(2, '0')}/${current.getDate().toString().padStart(2, '0')} ${current.getHours().toString().padStart(2, '0')}`;
        if (dataMap.has(label) || !skipZeroValues) {
          addLabel(label);
          count += 1;
        }
        current.setHours(current.getHours() + 1);
      }
    } else if (timePeriod === 'Daily') {
      const current = new Date(startDate);
      let count = 0;
      while (current <= effectiveEndDate && count < 30) {
        const label = `${current.getDate().toString().padStart(2, '0')}/${(current.getMonth() + 1).toString().padStart(2, '0')}`;
        if (dataMap.has(label) || !skipZeroValues) {
          addLabel(label);
          count += 1;
        }
        current.setDate(current.getDate() + 1);
      }
    } else if (timePeriod === 'Monthly') {
      const current = new Date(startDate);
      let count = 0;
      while (current <= effectiveEndDate && count < 12) {
        const label = `${current.toLocaleString('default', { month: 'short' })} ${String(current.getFullYear()).slice(-2)}`;
        if (dataMap.has(label) || !skipZeroValues) {
          addLabel(label);
          count += 1;
        }
        current.setMonth(current.getMonth() + 1);
      }
    } else if (timePeriod === 'Quarterly') {
      const current = new Date(startDate);
      let count = 0;
      while (current <= effectiveEndDate && count < 4) {
        const year = current.getFullYear();
        const quarter = Math.floor(current.getMonth() / 3) + 1;
        const label = `${year}-Q${quarter}`;
        if (dataMap.has(label) || !skipZeroValues) {
          addLabel(label);
          count += 1;
        }
        current.setMonth(current.getMonth() + 3);
      }
    } else if (timePeriod === 'Yearly') {
      const current = new Date(startDate);
      let count = 0;
      while (current <= effectiveEndDate && count < 5) {
        const label = String(current.getFullYear());
        if (dataMap.has(label) || !skipZeroValues) {
          addLabel(label);
          count += 1;
        }
        current.setFullYear(current.getFullYear() + 1);
      }
    } else {
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

  const isNotFound = !isLoading && !graphData.length;

  return (
    <Grid item xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Produced Length & Waste Over Time
        </Typography>

        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            {graphData?.length > 0 ? (
              <LogChartStacked processGraphData={processGraphData} graphLabels={graphLabels} isLoading={isLoading} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }} >
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

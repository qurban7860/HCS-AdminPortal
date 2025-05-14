/* eslint-disable no-restricted-syntax */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton } from '@mui/material';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LogLineChart from '../../../components/machineLogs/LogLineChart';

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toFixed(1);
};

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ErpProductionRateLogGraph = ({ timePeriod, customer, graphLabels, dateFrom, dateTo }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map((item) => ({
        ...item,
        productionRate: (item.componentLength / 1000 + item.waste / 1000) / (item.time / 3600000),
      }));
      setGraphData(convertedData);
    }
  }, [machineLogsGraphData]);

  const processGraphData = () => {
    if (!graphData || graphData.length === 0) {
      return null
    }

    const dataMap = new Map();
    graphData.forEach(item => dataMap.set(item._id, item));

    const labels = [];
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    if (timePeriod === 'Hourly') {
      const currentDate = new Date(startDate);
      let hourCount = 0;
      while (currentDate <= endDate && hourCount < 24) {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hour = String(currentDate.getHours()).padStart(2, '0');
        labels.push(`${month}/${day} ${hour}`);
        currentDate.setHours(currentDate.getHours() + 1);
        hourCount += 1;
      }
    } else if (timePeriod === 'Daily') {
      const currentDate = new Date(startDate);
      let dayCount = 0;
      while (currentDate <= endDate && dayCount < 30) {
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        labels.push(`${day}/${month}`);
        currentDate.setDate(currentDate.getDate() + 1);
        dayCount += 1;
      }
    } else if (timePeriod === 'Monthly') {
      const currentDate = new Date(startDate);
      let monthCount = 0;
      while (currentDate <= endDate && monthCount < 12) {
        const shortMonth = currentDate.toLocaleString('default', { month: 'short' });
        const yearShort = String(currentDate.getFullYear()).slice(-2);
        labels.push(`${shortMonth} ${yearShort}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
        monthCount += 1;
      }
    } else if (timePeriod === 'Quarterly') {
      const currentDate = new Date(startDate);
      let quarterCount = 0;
      while (currentDate <= endDate && quarterCount < 4) {
        const year = currentDate.getFullYear();
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        labels.push(`${year}-Q${quarter}`);
        currentDate.setMonth(currentDate.getMonth() + 3);
        quarterCount += 1;
      }
    } else if (timePeriod === 'Yearly') {
      const currentDate = new Date(startDate);
      let yearCount = 0;
      while (currentDate <= endDate && yearCount < 5) {
        labels.push(String(currentDate.getFullYear()));
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        yearCount += 1;
      }
    } else {
      return null;
    }

    const productionRate = labels.map(label => {
      let foundRate = 0;
      for (const value of dataMap.values()) {
        if (value._id.includes(label)) {
          foundRate = value.productionRate;
          break; 
        }
      }
      return foundRate;
    });

    return {
      categories: labels,
      series: [
        {
          label: 'Production Rate (m/hr)',
          data: productionRate,
          tension: 0.1
        }
      ]
      // datasets: [
      //   {
      //     label: 'Production Rate (m/hr)',
      //     data: productionRate,
      //     borderColor: '#4CAF50',
      //     backgroundColor: 'rgba(76, 175, 80, 0.1)',
      //     tension: 0.1
      //   },
      // ],
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
          Production Rate Over Time 
        </Typography>

        {isLoading && <Skeleton variant="rectangular" width="100%" height={120} />}
        {!isLoading && chartData ? (
          <div style={{ maxWidth: '100vh', margin: '0 auto' }}>
          <LogLineChart chart={chartData} graphLabels={graphLabels} />
            {/* <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Production Rate (m/hr)',
                      font: { size: 14, weight: 'bold' },
                      color: '#616161',
                    },
                    ticks: {
                      callback(value) {
                        return formatNumber(value);
                      },
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Time Period',
                      font: { size: 14, weight: 'bold' },
                      color: '#616161',
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45,
                      color: '#424242',
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { size: 14 }, color: '#424242' },
                  },
                  title: {
                    display: true,
                    text: 'Production Rate (m/hr)',
                    font: { size: 18, weight: 'bold' },
                  },
                  tooltip: {
                    backgroundColor: '#FFFFFFE6',
                    titleColor: 'black',
                    bodyColor: 'black',
                    borderColor: '#6b7280',
                    borderWidth: 0.5,
                    padding: 10,
                    displayColors: true,
                  },
                },
              }}
            /> */}
          </div>
        ) : (
          <Typography variant="body1" color="textSecondary">
            {customer?._id ? 'No data available' : "Please Select a customer to view the graph."}
          </Typography>
        )}
      </Card>
    </Grid>
  );
};

export default ErpProductionRateLogGraph;
ErpProductionRateLogGraph.propTypes = {
  timePeriod: PropTypes.oneOf(['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']).isRequired,
  customer: PropTypes.object,
  graphLabels: PropTypes.object,
  dateFrom: PropTypes.instanceOf(Date),
  dateTo: PropTypes.instanceOf(Date),
};

/* eslint-disable no-restricted-syntax */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo } from 'react'; 
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton, Box } from '@mui/material'; 
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import LogLineChart from '../../../components/machineLogs/LogLineChart';
import { TableNoData } from '../../../components/table'; 

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toFixed(1);
};

const ErpProductionRateLogGraph = ({ timePeriod, customer, graphLabels, dateFrom, dateTo }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map((item) => ({
        ...item,
        productionRate: item.time > 0 ? (item.componentLength / 1000 + item.waste / 1000) / (item.time / 3600000) : 0,
        _id: timePeriod === 'Monthly' ? item._id.replace(/^Sep /, 'Sept ') : item._id,
      }));
      setGraphData(convertedData);
    }
  }, [machineLogsGraphData, timePeriod]);

  const processGraphData = useMemo(() => {
    if (!graphData || graphData.length === 0) {
      return null;
    }

    const sortedGraphData = [...graphData].sort((a, b) => {
      let dateA; let dateB;
      if (timePeriod === 'Hourly') {
        const [monthDayA, hourA] = a._id.split(' ');
        const [monthA, dayA] = monthDayA.split('/');
        const [monthDayB, hourB] = b._id.split(' ');
        const [monthB, dayB] = monthDayB.split('/');
        dateA = new Date(`${new Date().getFullYear()}-${monthA}-${dayA}T${hourA}:00:00`);
        dateB = new Date(`${new Date().getFullYear()}-${monthB}-${dayB}T${hourB}:00:00`);
      } else if (timePeriod === 'Daily') {
        const [dayA, monthA] = a._id.split('/');
        const [dayB, monthB] = b._id.split('/');
        dateA = new Date(`${new Date().getFullYear()}-${monthA}-${dayA}`);
        dateB = new Date(`${new Date().getFullYear()}-${monthB}-${dayB}`);
      } else if (timePeriod === 'Monthly') {
        dateA = new Date(a._id.replace(/(\w+)\s(\d+)/, (_, m, y) => `${m} 1, 20${y}`));
        dateB = new Date(b._id.replace(/(\w+)\s(\d+)/, (_, m, y) => `${m} 1, 20${y}`));
      } else if (timePeriod === 'Quarterly') {
        const [yearA, quarterStrA] = a._id.split('-Q');
        const monthA = (parseInt(quarterStrA, 10) - 1) * 3;
        dateA = new Date(parseInt(yearA, 10), monthA);

        const [yearB, quarterStrB] = b._id.split('-Q');
        const monthB = (parseInt(quarterStrB, 10) - 1) * 3;
        dateB = new Date(parseInt(yearB, 10), monthB);
      } else if (timePeriod === 'Yearly') {
        dateA = new Date(parseInt(a._id, 10), 0);
        dateB = new Date(parseInt(b._id, 10), 0);
      }
      return dateA - dateB;
    });


    let limitedData = sortedGraphData;
    let limit = 0;

    switch (timePeriod) {
      case 'Hourly':
        limit = 24; 
        break;
      case 'Daily':
        limit = 30; 
        break;
      case 'Monthly':
        limit = 12; 
        break;
      case 'Quarterly':
        limit = 4; 
        break;
      case 'Yearly':
        limit = 5; 
        break;
      default:
        limit = graphData.length; 
    }

    if (limitedData.length > limit) {
      limitedData = limitedData.slice(-limit);
    }

    const labels = limitedData.map(item => item._id);
    const productionRate = limitedData.map(item => item.productionRate);

    return {
      categories: labels,
      series: [
        {
          label: 'Production Rate (m/hr)',
          data: productionRate.map(rate => parseFloat(formatNumber(rate))),
          tension: 0.1
        }
      ]
    };
  }, [graphData, timePeriod]); 

  const isNotFound = !isLoading && !graphData.length;

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

        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 1 }} />
        ) : (
          <>
            {graphData?.length > 0 && processGraphData ? (
              <div style={{ maxWidth: '100vh', margin: '0 auto' }}>
                <LogLineChart chart={processGraphData} graphLabels={graphLabels} />
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

export default ErpProductionRateLogGraph;
ErpProductionRateLogGraph.propTypes = {
  timePeriod: PropTypes.oneOf(['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']).isRequired,
  customer: PropTypes.object,
  graphLabels: PropTypes.object,
  dateFrom: PropTypes.instanceOf(Date),
  dateTo: PropTypes.instanceOf(Date),
};
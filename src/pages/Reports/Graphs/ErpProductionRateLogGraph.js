import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toFixed(1);
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ErpProductionRateLogGraph = ({ timePeriod, customer }) => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map(item => ({
        ...item,
        productionRate: (item.componentLength / 1000) / (item.time / 3600000)
      }));
      setGraphData(convertedData);
    }
  }, [machineLogsGraphData]);
  const processGraphData = () => {
    if (!graphData || graphData.length === 0) {
      return null;
    }

    const sortedData = [...graphData];
    let labels = sortedData.map(item => item._id);

    switch (timePeriod) {
      case 'Daily':
        sortedData.sort((a, b) => new Date(a._id) - new Date(b._id));
        labels = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${month}/${day}`;
        }).reverse();
        break;
      case 'Monthly':
        sortedData.sort((a, b) => {
          const [yearA, monthA] = a._id.split('-');
          const [yearB, monthB] = b._id.split('-');
          return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });
        labels = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          return `${year}-${month}`;
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

    const productionRate = labels.map(label => {
      const dataPoint = sortedData.find(item => item._id.includes(label));
      return dataPoint ? dataPoint.productionRate : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Production Rate (m/hr)',
          data: productionRate,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.1
        },
      ],
    };
  };
  const chartData = processGraphData();

  const getDataRangeText = () => {
    switch (timePeriod) {
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
          Production Rate Over Time (For the {getDataRangeText()})
        </Typography>

        {isLoading && <Skeleton variant="rectangular" width="100%" height={120} />}
        {!isLoading && chartData ? (
          <div style={{ maxWidth: '100vh', margin: '0 auto' }}>
            <Line
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
            />
          </div>
        ) : (
          <Typography variant="body1" color="textSecondary">
            {customer?._id ? `No data available for the ${getDataRangeText()}.` : "Please Select a customer to view the graph."}
          </Typography>
        )}
      </Card>
    </Grid>
  );
};

export default ErpProductionRateLogGraph;
ErpProductionRateLogGraph.propTypes = {
  timePeriod: PropTypes.string,
  customer: PropTypes.object,
};

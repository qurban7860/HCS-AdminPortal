import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Grid, Skeleton } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toFixed(1);
};

const barTotalPlugin = {
  id: 'barTotal',
  afterDatasetsDraw: (chart, args, options) => {
    const { ctx, data } = chart;
    ctx.save();
    ctx.font = '11px Arial';
    ctx.fillStyle = '#616161';
    ctx.textAlign = 'center';

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];
        const formattedValue = formatNumber(value);
        ctx.fillText(formattedValue, bar.x, bar.y - 5);
      });
    });
    ctx.restore();
  }
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, barTotalPlugin);

const ErpProducedLengthLogGraph = () => {
  const [graphData, setGraphData] = useState([]);
  const { isLoading, machineLogsGraphData } = useSelector((state) => state.machineErpLogs);

  useEffect(() => {
    if (machineLogsGraphData) {
      const convertedData = machineLogsGraphData.map(item => ({
        ...item,
        componentLength: item.componentLength / 1000,
        waste: item.waste / 1000
      }));
      setGraphData(convertedData);
    }
  }, [machineLogsGraphData]);
  

  const processGraphData = () => {
    if (!graphData || graphData.length === 0) {
      return null;
    }

    const sortedData = [...graphData].sort((a, b) => a._id.localeCompare(b._id));

    const labels = sortedData.map(item => item._id);
    const producedLength = sortedData.map(item => item.componentLength);
    const wasteLength = sortedData.map(item => item.waste);

    return {
      labels,
      datasets: [
        { label: 'Produced Length (m)', data: producedLength, backgroundColor: '#A9E0FC' },
        { label: 'Waste Length (m)', data: wasteLength, backgroundColor: '#FCB49F' },
      ],
    };
  };

  const chartData = processGraphData();

  return (
    <Grid xs={12} sm={12} md={12} lg={10} xl={6} sx={{ mt: 3}}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Produced Length & Waste Over Time
        </Typography>

        {isLoading && <Skeleton variant="rectangular" width="100%" height={120} />}
        {!isLoading && chartData ? (
          <div style={{ maxWidth: '100vh', margin: '0 auto' }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                elements: {
                  bar: {
                    borderRadius: 3,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Meters',
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
                    text: 'Produced & Waste Length (m)',
                    font: { size: 18, weight: 'bold' },
                  },
                  barTotal: {},
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
            No data available.
          </Typography>
        )}
      </Card>
    </Grid>
  );
};

export default ErpProducedLengthLogGraph;

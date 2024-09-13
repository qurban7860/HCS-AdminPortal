import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Card, Grid, Skeleton } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import MachineLogsList from '../machine/logs/MachineLogsList';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LogGraphReport = () => {
  const location = useLocation();
  const { logs } = location.state || {};
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const Data = [
      { date: '2024-09-01', count: 10 },
      { date: '2024-09-02', count: 20 },
      { date: '2024-09-03', count: 15 },
      { date: '2024-09-04', count: 25 },
      { date: '2024-09-05', count: 30 },
    ];

    const dataToUse = logs && logs.length > 0 ? logs : Data;

    const dates = dataToUse.map(log => log.date);
    const logCounts = dataToUse.map(log => log.count);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Log Entries',
            data: logCounts,
            borderColor: '#42a5f5',
            backgroundColor: 'rgba(66, 165, 245, 0.3)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#42a5f5',
            pointHoverBackgroundColor: '#42a5f5',
            pointHoverBorderColor: '#fff',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      });
  }, [logs]);

  return (
    <>
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Logs Graph Report" />
      </StyledCardContainer>
    </Container>
      <MachineLogsList logs={logs} />
    {/* <Container maxWidth={false}>
      <Grid container mt={1} spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Log Entries Over Time
            </Typography>
            {!chartData ? (
            <Skeleton variant="rectangular" width="100%" height={400} />
          ) : (
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { callbacks: { label: (tooltipItem) => `Logs: ${tooltipItem.raw}` }},
                  title: { display: true, text: 'Log Entries by Date', font: { size: 14, weight: 'bold' }, color: '#616161' },
                },
                scales: {
                  x: { title: { display: true, text: 'Dates', font: { size: 12, weight: 'bold' }, color: '#616161' },
                    ticks: { maxRotation: 45, minRotation: 45 },
                  },
                  y: {
                    title: { display: true, text: 'Number of Logs', font: { size: 12, weight: 'bold' }, color: '#616161' },
                  },
                },
              }}
            />
          )}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              Log Entries Distribution
            </Typography>
            {!chartData ? (
            <Skeleton variant="rectangular" width="100%" height={400} />
          ) : (
            <Bar data={chartData}
              options={{ responsive: true, maintainAspectRatio: true,
                plugins: { legend: { position: 'top' },
                  tooltip: { callbacks: { label: (tooltipItem) => `Logs: ${tooltipItem.raw}` }},
                  title: { display: true, text: 'Log Entries by Date (Bar Chart)', font: { size: 14, weight: 'bold' }, color: '#616161' },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Dates', font: { size: 12, weight: 'bold' }, color: '#616161' },
                  },
                  y: { 
                    title: { display: true, text: 'Number of Logs', font: { size: 12, weight: 'bold' }, color: '#616161' },
                  },
                },
              }}
            />
          )}
          </Card>
        </Grid>
      </Grid>
    </Container> */}
    </>
  );
};

export default LogGraphReport;

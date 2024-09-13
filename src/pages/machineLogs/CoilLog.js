import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, Grid, Box, Skeleton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Data = {
  timestamps: [
    '2021-10-05T11:28:45',
    '2021-10-05T11:29:31',
    '2021-10-07T07:40:39',
    '2021-10-12T08:12:59',
    '2021-10-12T12:04:29',
    '2021-10-12T14:23:03',
    '2021-10-12T15:35:04',
    '2021-10-19T09:13:09',
    '2021-10-20T09:44:32',
    '2021-10-26T08:23:13',
    '2021-10-29T08:56:32',
  ],
  measurements: [1.6, 1.6, 1.6, 1.15, 0.95, 0.95, 0.95, 1.57, 0.95, 0.75, 1.57],
};

const CoilLogGraph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/1.0.0/logs/coil/graph');
        const { timestamps, measurements } = response.data;
        if (Array.isArray(timestamps)) {
          setChartData({
            labels: timestamps,
            datasets: [
              {
                label: 'Coil Measurement (mm)',
                data: measurements,
                borderColor: '#1e88e5',
                backgroundColor: 'rgba(30, 136, 229, 0.2)',
                fill: true,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4,
                pointBorderColor: '#1e88e5',
                pointBackgroundColor: '#fff',
              },
            ],
          });
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching Coil logs data, using example data:', err);
        setChartData({
          labels: Data.timestamps,
          datasets: [
            {
              label: 'Coil Measurement (mm)',
              data: Data.measurements,
              borderColor: '#1e88e5',
              backgroundColor: 'rgba(30, 136, 229, 0.2)',
              fill: true,
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 4,
              pointBorderColor: '#1e88e5',
              pointBackgroundColor: '#fff',
            },
          ],
        });
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Coil Logs" backLink coilLog erpLog productionLog />
      </StyledCardContainer>
      <Box display="flex" flexDirection="column" width="100%">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
          <Card sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Coil Log Data
            </Typography>
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {!chartData ? (
            <Skeleton variant="rectangular" width="100%" height={500} />
          ) : (
              <Line
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: true,
                  scales: {
                    x: {
                      title: { display: true, text: 'Timestamp', font: { size: 14, weight: 'bold' }, color: '#616161' },
                      ticks: { autoSkip: true, maxTicksLimit: 10, color: '#616161' }
                    },
                    y: {
                      title: { display: true, text: 'Measurement (mm)', font: { size: 14, weight: 'bold' }, color: '#616161' },
                      ticks: { stepSize: 0.5 }, min: 0, max: 2,
                    },
                  },
                  plugins: {
                    legend: { display: true, position: 'top', labels: { font: { size: 14 }, color: '#424242' }},
                    tooltip: { mode: 'index', intersect: false },
                    title: { display: true, text: 'Coil Log Overview', font: { size: 18, weight: 'bold' }, color: '#424242' }
                  },
                }}
              />
          )};
            </div>
          </Card>
        </Grid>
      </Box>
    </Container>
  );
};

export default CoilLogGraph;

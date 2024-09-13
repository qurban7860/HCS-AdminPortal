import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, Grid, Skeleton } from '@mui/material';
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
    '2019-10-25T11:19:17',
    '2019-10-30T09:34:57',
    '2019-10-30T09:35:02',
    '2019-10-30T10:27:29',
    '2019-10-30T10:27:34',
    '2019-10-30T10:28:47',
    '2019-10-30T10:46:24',
    '2019-10-30T10:47:18',
    '2019-10-30T10:47:52',
  ],
  thicknesses: [0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84, 0.84],
  wastes: [0.0, 0.0, 2000.0, 0.0, 2000.0, 0.0, 0.0, 0.0, 0.0],
  durations: [25.408, 4.513, 5.183, 4.505, 5.171, 82.859, 1139.618, 1193.875, 1227.623],
};

const ErpLog = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/1.0.0/logs/erp/graph');
        const { timestamps, thicknesses, wastes, durations } = response.data;

        if (Array.isArray(timestamps)) {
          setChartData({
            labels: timestamps,
            datasets: [
              {
                label: 'Material Thickness (mm)',
                data: thicknesses,
                borderColor: '#42a5f5',
                backgroundColor: 'rgba(66, 165, 245, 0.3)',
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y',
              },
              {
                label: 'Waste Length (mm)',
                data: wastes,
                borderColor: '#ff7043',
                backgroundColor: 'rgba(255, 112, 67, 0.3)',
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y1',
              },
              {
                label: 'Production Duration (s)',
                data: durations,
                borderColor: '#66bb6a',
                backgroundColor: 'rgba(102, 187, 106, 0.3)',
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                yAxisID: 'y2',
              },
            ],
          });
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err) {
        console.error('Error fetching ERP logs data, using example data:', err);

        setChartData({
          labels: Data.timestamps,
          datasets: [
            {
              label: 'Material Thickness (mm)',
              data: Data.thicknesses,
              borderColor: '#42a5f5',
              backgroundColor: 'rgba(66, 165, 245, 0.3)',
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              label: 'Waste Length (mm)',
              data: Data.wastes,
              borderColor: '#ff7043',
              backgroundColor: 'rgba(255, 112, 67, 0.3)',
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              yAxisID: 'y1',
            },
            {
              label: 'Production Duration (s)',
              data: Data.durations,
              borderColor: '#66bb6a',
              backgroundColor: 'rgba(102, 187, 106, 0.3)',
              fill: true,
              borderWidth: 2,
              tension: 0.4,
              yAxisID: 'y2',
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
        <Cover name="ERP Logs" backLink coilLog erpLog productionLog />
      </StyledCardContainer>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
        <Card sx={{ p: 4, boxShadow: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            ERP Production Data
          </Typography>
          {!chartData ? (
            <Skeleton variant="rectangular" width="100%" height={120} />
          ) : (
            <Line
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: true,
                scales: {
                  y: { 
                    type: 'linear', position: 'left', title: { display: true, text: 'Thickness (mm)', font: { size: 14, weight: 'bold', }, color: '#616161' },
                  },
                  y1: { 
                    type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Waste Length (mm)', font: { size: 14, weight: 'bold' }, color: '#616161' },
                  },
                  y2: { 
                    type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Production Duration (s)', font: { size: 14, weight: 'bold' }, color: '#616161' },
                  },
                },
                plugins: {
                  legend: { display: true, position: 'top', labels: { font: { size: 14 }, color: '#424242' }},
                  tooltip: { mode: 'index', intersect: false },
                  title: { display: true, text: 'ERP Production Overview', font: { size: 18, weight: 'bold' }, color: '#424242' },
                },
              }}
              height={120}
            />
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default ErpLog;

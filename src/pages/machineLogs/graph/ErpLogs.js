/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Card, Grid, Skeleton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
   
const dummyData = [
  { _id: '2024-01-01', componentLength: 150, waste: 20 },
  { _id: '2024-02-01', componentLength: 180, waste: 25 },
  { _id: '2024-03-01', componentLength: 130, waste: 18 },
  { _id: '2024-04-01', componentLength: 200, waste: 30 },
  { _id: '2024-05-01', componentLength: 220, waste: 40 },
];

const calculateCumulativeData = (data) => data.reduce((acc, curr) => {
  if (acc.length === 0) {
    acc.push(curr);
  } else {
    acc.push(acc[acc.length - 1] + curr);
  }
  return acc;
}, []);

const groupDataByTime = (timestamps, producedLength, wasteLength, period) => {
  const groupedData = {
    timestamps: [],
    producedLength: [],
    wasteLength: [],
  };

  let currentPeriod = null;
  let cumulativeProduced = 0;
  let cumulativeWaste = 0;

  for (let i = 0; i < timestamps.length; i += 1) {
    const date = new Date(timestamps[i]);
    let periodLabel;

    if (period === 'monthly') {
      periodLabel = `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else if (period === 'quarterly') {
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      periodLabel = `${date.getFullYear()}-Q${quarter}`;
    } else if (period === 'yearly') {
      periodLabel = `${date.getFullYear()}`;
    }

    if (currentPeriod !== periodLabel) {
      if (currentPeriod) {
        groupedData.timestamps.push(currentPeriod);
        groupedData.producedLength.push(cumulativeProduced);
        groupedData.wasteLength.push(cumulativeWaste);
      }
      currentPeriod = periodLabel;
      cumulativeProduced = 0;
      cumulativeWaste = 0;
    }

    cumulativeProduced += producedLength[i];
    cumulativeWaste += wasteLength[i];
  }

  groupedData.timestamps.push(currentPeriod);
  groupedData.producedLength.push(cumulativeProduced);
  groupedData.wasteLength.push(cumulativeWaste);

  return groupedData;
};

const ErpLogs = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [graphData] = useState(dummyData);
  const { isLoading } = useSelector((state) => state.machineErpLogs);

  const handleTimePeriodChange = (event) => {
    const selectedPeriod = event.target.value.toLowerCase(); 
    setTimePeriod(selectedPeriod);
  };
  
  const processGraphData = () => {
    if (!graphData || graphData.length === 0) {
      return null;
    }

    const validData = graphData.filter(
      (data) => data._id && (data.componentLength !== 0 || data.waste !== 0)
    );
    
    if (validData.length === 0) {
      return null;
    }

    const timestamps = validData.map((data) => data._id);
    const producedLength = validData.map((data) => data.componentLength);
    const wasteLength = validData.map((data) => data.waste);

    const cumulativeProduced = calculateCumulativeData(producedLength);
    const cumulativeWaste = calculateCumulativeData(wasteLength);

    const groupedData = groupDataByTime(
      timestamps,
      cumulativeProduced,
      cumulativeWaste,
      timePeriod
    );

    return {
      labels: groupedData.timestamps,
      datasets: [
        { label: 'Produced Length (m)', data: groupedData.producedLength, backgroundColor: '#1976D2', borderColor: '#000', borderWidth: 1 },
        { label: 'Waste Length (m)', data: groupedData.wasteLength, backgroundColor: '#008000', borderColor: '#000', borderWidth: 1 },
      ],
    };
  };

  const chartData = processGraphData();

  return (
    <Container maxWidth={false} sx={{ mt: 3 }}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
        <Card sx={{ p: 4, boxShadow: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Produced & Waste Length Over Time
          </Typography>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Time Period</InputLabel>
            <Select value={timePeriod} label="Time Period" onChange={handleTimePeriodChange}>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={120} />
          ) : (
            chartData ? (   
            <>
              {dummyData && (
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No valid data available for this time period. Showing dummy data.
                </Typography>
              )}      
              <Bar
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Meters', font: { size: 14, weight: 'bold' }, color: '#616161' },
                    },
                    x: {
                      title: { display: true, text: 'Time Period', font: { size: 14, weight: 'bold' }, color: '#616161' },
                    },
                  },
                  plugins: {
                    legend: { display: true, position: 'top', labels: { font: { size: 14 }, color: '#424242' } },
                    title: { display: true, text: `Produced & Waste Length (${timePeriod})`, font: { size: 18, weight: 'bold' } },
                  },
                }}
              />
              </>
            ) : (
              <Typography variant="body1" color="textSecondary">
                No valid data available for this time period.
              </Typography>
            )
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default ErpLogs;

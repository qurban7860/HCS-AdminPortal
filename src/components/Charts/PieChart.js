import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Grid, Divider } from '@mui/material';
import { useChart } from '../chart';

const PieChart = ({ chartData, totalIssues, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const getTotalIssues = () => hoveredIndex !== null ? chartData.series[hoveredIndex] : totalIssues;

  const chartOptions = useChart({
    chart: { type: 'donut', width: 400 },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Issues',
              formatter: () => `${getTotalIssues()}`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: (value, { seriesIndex }) => `${chartData.series[seriesIndex]}`,
      },
    },
    fill: {
      opacity: hoveredIndex !== null 
        ? chartData.series.map((_, i) => (i === hoveredIndex ? 1 : 0.3)) 
        : 1,
    },
    stroke: {
      show: true,
      width: 2,
      colors: hoveredIndex !== null
      ? chartData.series.map((_, i) => (i === hoveredIndex ? chartData.colors[i] : '#ccc'))
      : chartData.colors, 
    },
  });

  return (
    <Grid container>
     <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
      {title}
    </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: 'center' }}>
            <ReactApexChart
              type="donut"
              series={chartData.series}
              options={chartOptions}
              height={350}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title.includes('Statuses') ? 'Statuses' : 'Issue Types'}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Total Issues: <span style={{ color: '#000', fontWeight: 'bold' }}>{getTotalIssues()}</span>
          </Typography>
          <Divider />
          <Box sx={{ mt: 2 }}>
            {chartData.labels.map((label, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: chartData.colors[index],
                      marginRight: '8px',
                      transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)', 
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 'bold', color: hoveredIndex === index ? '#000' : '#666' }}
                  >
                    {label}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {chartData.series[index]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

PieChart.propTypes = {
  chartData: PropTypes.shape({
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  totalIssues: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default PieChart;


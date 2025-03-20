import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography, Grid, Divider, Select, MenuItem, FormControl, InputLabel, IconButton} from '@mui/material';
import { useChart } from '../chart';
import Iconify from '../iconify';

const PieChart = ({ chartData, totalIssues, isOpened, title, onPeriodChange, onExpand }) => {
  const [period, setPeriod] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const getTotalIssues = () => hoveredIndex !== null ? chartData.series[hoveredIndex] : totalIssues;

  const chartOptions = useChart({
    chart: { type: 'donut' },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '40%',
          labels: {
            show: true,
            total: {
              show: true,
              label: hoveredIndex !== null ? chartData.labels[hoveredIndex] : 'Total Issues',
              color: hoveredIndex !== null ? chartData.colors[hoveredIndex] : '#000',
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
  
  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value;
    setPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  return (
    <Grid container>
      <Typography variant="h4" sx={{ mb: 2, mt: onExpand ? 0 : 2, fontWeight: 'bold' }}>
      {isOpened ? "Open Support Tickets" : "All Support Tickets"}
      </Typography>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end', m: 1, mt: -4,}}>
        <FormControl sx={{ minWidth: onExpand ? 120 : 200 }} size="small">
          <InputLabel id="period-select-label">Period</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={period}
            label="Period"
            onChange={handlePeriodChange}
            >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="1 month">1 Month</MenuItem>
            <MenuItem value="3 month">3 Months</MenuItem>
            <MenuItem value="6 month">6 Months</MenuItem>
            <MenuItem value="1 year">1 Year</MenuItem>
            <MenuItem value="2 year">2 Years</MenuItem>
            <MenuItem value="5 year">5 Years</MenuItem>
          </Select>
        </FormControl>
        {onExpand && (
          <IconButton size="large" color="primary" onClick={onExpand}>
            <Iconify icon="fluent:expand-up-right-20-filled" />
          </IconButton>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Box sx={{ mt: -1, mb: 2, textAlign: 'center' }}>
            <ReactApexChart
              type="donut"
              series={chartData.series}
              options={chartOptions}
              height={onExpand ? 250 : 300}
              width={onExpand ? 250 : 300}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ml: -1, mt: -1}}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Divider />
          <Box sx={{ mt: 2, mb: 2, maxHeight: "auto", overflowY: "visible" }}>
            {chartData.labels.slice(0, 20).map((label, index) => (
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
                <Box sx={{mr: 1}}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {chartData.series[index]}
                </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Divider />
          <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2, mb: 2 }}>
            Tickets: <span style={{ color: '#000', fontWeight: 'bold' }}>{totalIssues}</span>
          </Typography>
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
  isOpened: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func,
  onExpand: PropTypes.func,
};

export default PieChart;


import PropTypes from 'prop-types';
import { useState } from 'react';
import { Card, CardHeader, Box, Divider, useTheme } from '@mui/material';
import { CustomSmallSelect } from '../../../components/custom-input';
import Chart, { useChart } from '../../../components/chart';
import { StyledBg } from '../../../theme/styles/default-styles';
import { varFade } from '../../../components/animate';
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

ERPLog.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.func,
};

export default function ERPLog({ chart, title, subheader }) {
  const theme = useTheme();
  const { categories, series } = chart;
  const colors = [theme.palette.primary.main, theme.palette.orange.main]

  const chartOptions = useChart({
    chart: {
      type: 'bar',
      height: 320,
      stacked: true,
    },
    colors,
    plotOptions: {
      bar: {
        horizontal: false
      },
    },
    legend: {
      show: false,
    },
    xaxis: {categories},
    yaxis: {
      labels: {
        formatter: (value) => fShortenNumber(value),
      }
    },
    tooltip: {
      // y: {
      //   formatter: (value) => fMillion(value),
      // },

      custom: ({ series: tooltipSeries, seriesIndex, dataPointIndex, w }) => {
        const category = w.globals.labels[dataPointIndex];

        let tooltipContent = `<div class="apexcharts-theme-light">`;
        
        tooltipSeries.forEach((s, index) => {
          const legend = w.globals.seriesNames[index];
          const color = w.globals.colors[index];
          const value = fShortenNumber(s[dataPointIndex]);
          tooltipContent += `<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">`;
          tooltipContent += `<span class="apexcharts-tooltip-marker" style="background-color: ${color};"></span>`;
          tooltipContent += `<div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-label">${legend}:</span>`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-value">${value}</span></div></div></div>`;
       
        });
        
        tooltipContent+=`</div>`;
        return tooltipContent;
      },
    }
  });

  return (
    <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
      <CardHeader titleTypographyProps={{variant:'h5'}} title={title} sx={{mt:1, mb:2}} />
      <Divider />
      <Chart type="bar" series={series} options={chartOptions} height={chartOptions.chart.height} />        
      {/* {series.map((item) => (
        <Box key={item.day} sx={{ mt: 3, mx: 3 }} dir="ltr">
        </Box>
      ))} */}
      <StyledBg />
    </Card>
  );
}

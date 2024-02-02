import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import Chart, { useChart } from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

ChartStacked.propTypes = {chart: PropTypes.object};

export default function ChartStacked({ chart }) {
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

  return (<Chart type="bar" series={series} options={chartOptions} height={chartOptions.chart.height} />);
}

import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';
// ----------------------------------------------------------------------
LogChartStacked.propTypes = { chart: PropTypes.object, graphLabels: PropTypes.object };
export default function LogChartStacked({ chart, graphLabels }) {
  // const theme = useTheme();
  const { categories, series } = chart;
  const colors = ['#A9E0FC', '#FCB49F'];
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 320,
      stacked: true,
      animations: {
        enabled: false,
      },
    },
    colors,
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: false,
        },
      },
      colors: {
        ranges: [
          {
            from: 0,
            to: Infinity,
            color: colors,
          },
        ],
        backgroundBarColors: colors,
        backgroundBarOpacity: 1,
      },
    },
    dataLabels: {
      enabled: true,
      orientation: "vertical",
      formatter(val, { seriesIndex, dataPointIndex, w }) {
        if (seriesIndex === 1) return '';
        const total = Number(val) + Number(w.config.series[1].data[dataPointIndex]);
        return total === 0
          ? ''
          : fShortenNumber(total)},
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      },
    },
    xaxis: {
      categories,
      position: 'bottom',
      labels: {
        offsetY: 8,
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      title: {
        text: graphLabels?.xaxis,
        offsetX: 0,
        offsetY: -12,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        formatter: (value) =>
          value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      },
      title: {
        text: graphLabels?.yaxis,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
        },
      },
    },
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    tooltip: {
      custom: ({ series: tooltipSeries, seriesIndex, dataPointIndex, w }) => {
        let tooltipContent = `<div class="apexcharts-theme-light">`;
        tooltipSeries.forEach((s, index) => {
          const legend = w.globals.seriesNames[index];
          const color = w.globals.colors[index];
          const value = s[dataPointIndex];
          const valueText =
            value === 0
              ? ''
              : value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
          tooltipContent += `<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">`;
          tooltipContent += `<span class="apexcharts-tooltip-marker" style="background-color: ${color};"></span>`;
          tooltipContent += `<div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-label">${legend}:</span>`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-value">${valueText}</span></div></div></div>`;
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
  };
  return (
    <Chart type="bar" series={series} options={chartOptions} height={chartOptions.chart.height} />
  );
  // return (<Chart type="bar" series={filteredSeries} options={chartOptions} height={chartOptions.chart.height} />);
}

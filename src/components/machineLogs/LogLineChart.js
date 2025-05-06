import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

LogLineChart.propTypes = { chart: PropTypes.object, graphLabels: PropTypes.object };
export default function LogLineChart({ chart, graphLabels }) {
  const theme = useTheme();
  const { categories, series } = chart;
  const colors = ["#50AB4F", theme.palette.success.main];
  const menuBackgroundColor = theme.palette.common.white;

  const menuTextColor = theme.palette.common.black;

  const chartOptions = {
    chart: {
      type: 'line',
      // height: graphHeight,
      foreColor: theme.palette.grey[500],
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
      animations: { enabled: false },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: { width: '100%' },
          legend: { position: 'bottom' },
        },
      },
    ],
    colors,
    stroke: {
      curve: 'straight',
      width: 3,
    },
    // dataLabels: {
    //   enabled: true,
    //   formatter(val, { seriesIndex, dataPointIndex, w }) {
    //     if (seriesIndex === 1) return ''
    //     return val === 0 ? '' : val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    //   },
    //   offsetY: -10,
    //   style: {
    //     fontSize: '12px',
    //     colors: [themeMode === KEY.LIGHT ? theme.palette.grey[800] : theme.palette.grey[400]]
    //   }
    // },
    xaxis: {
      categories,
      position: 'bottom',
      labels: {
        offsetY: 0,
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: { show: false, color: theme.palette.grey[500] },
      axisTicks: { show: false, color: theme.palette.grey[500] },
      title: {
        text: graphLabels?.xaxis,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: {
      title: {
        text: graphLabels?.yaxis,
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
          color: theme.palette.grey[500],
        },
      },
      labels: {
        formatter: (value) =>
          value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        style: { fontSize: '12px', color: theme.palette.grey[800] },
      },
    },
    tooltip: {
      custom: ({ series: tooltipSeries, seriesIndex, dataPointIndex, w }) => {
        let tooltipContent = `<div class="apexcharts-theme-light">`;
        tooltipSeries.forEach((s, index) => {
          const legend = 'Production Rate: ';
          const color = w.globals.colors[index];
          const value = s[dataPointIndex].toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          tooltipContent += `<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">`;
          tooltipContent += `<span class="apexcharts-tooltip-marker" style="background-color: ${color};"></span>`;
          tooltipContent += `<div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-label">${legend}:</span>`;
          tooltipContent += `<span class="apexcharts-tooltip-text-y-value">${value}</span></div></div></div>`;
        });

        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
    grid: {
      borderColor: theme.palette.grey[400],
      opacity: 0.3,
    },
    markers: {
      size: 4,
    },
    fill: {
      type: 'gradient',
    },
  };

  return (
    <>
      <style>{`
    .apexcharts-menu {
      background-color: ${menuBackgroundColor} !important;
      color: ${menuTextColor} !important;
      border-radius: 2px;
      border: 1px solid ${menuBackgroundColor};
    }
  `}</style>
      <Chart
        type="line"
        series={series}
        options={chartOptions}
        // height={chartOptions.chart.height}
      />
    </>
  );
}

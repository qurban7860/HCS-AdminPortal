import React from 'react';
import PropTypes from 'prop-types';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

function BarChart({ chartData, title }) {
  const { labels, series } = chartData;
  const colors = ['#A9E0FC', '#FCB49F'];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 320,
      stacked: false,
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
      formatter: (val) => (val === 0 ? '' : `${val}`),
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      categories: labels,
      position: 'bottom',
      labels: {
        offsetY: 0,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      title: {
        text: 'Dates',
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        formatter: (value) => fShortenNumber(value),
      },
      title: {
        text: 'Ticket Count',
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
          if (value > 0) {
            tooltipContent += `<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">`;
            tooltipContent += `<span class="apexcharts-tooltip-marker" style="background-color: ${color};"></span>`;
            tooltipContent += `<div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">`;
            tooltipContent += `<span class="apexcharts-tooltip-text-y-label">${legend}:</span>`;
            tooltipContent += `<span class="apexcharts-tooltip-text-y-value">${value}</span></div></div></div>`; 
          }
        });
        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
  };

  return (
    <div>
      <h3>{title}</h3>
      <Chart type="bar" series={series} options={chartOptions} height={chartOptions.chart.height} />
    </div>
  );
}

BarChart.propTypes = {
  chartData: PropTypes.shape({
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
      })
    ).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

export default BarChart;
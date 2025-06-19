import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

LogChartStacked.propTypes = {
  processGraphData: PropTypes.func.isRequired, 
  graphLabels: PropTypes.object,
};

export default function LogChartStacked({ processGraphData, graphLabels }) {
  const [skipZero, setSkipZero] = useState(true);
  const [chart, setChart] = useState({ categories: [], series: [] });

  useEffect(() => {
    const processedChartData = processGraphData(skipZero);
    if (processedChartData) {
      setChart(processedChartData);
    } else {
      setChart({ categories: [], series: [] }); 
    }
  }, [skipZero, processGraphData]);

  const { categories, series } = chart;

  const colors = ['#A9E0FC', '#FCB49F'];

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
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
          : fShortenNumber(total);
      },
      offsetY: -25,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      },
    },
    xaxis: {
      categories,
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
        offsetX: -5,
        offsetY: 0,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
        },
      },
    },
    legend: {
      onItemClick: { toggleDataSeries: false },
    },
    tooltip: {
      followCursor: true,
      custom: ({ series: tooltipSeries, dataPointIndex, w }) => {
        let tooltipContent = `<div class="apexcharts-theme-light" style="padding: 8px;">`;
        let total = 0;

        tooltipSeries.forEach((s, index) => {
          const legend = w.globals.seriesNames[index];
          const color = w.globals.colors[index];
          const value = s[dataPointIndex];
          total += value;

          const valueText =
            value === 0
              ? ''
              : value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

          tooltipContent += `
        <div class="apexcharts-tooltip-series-group apexcharts-active" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <span class="apexcharts-tooltip-marker" style="background-color: ${color}; margin-right: 8px;"></span>
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="apexcharts-tooltip-text-y-label" style="margin-right: 8px;">${legend}:</span>
            <span class="apexcharts-tooltip-text-y-value">${valueText}</span>
          </div>
        </div>`;
        });

        const totalText = total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        tooltipContent += `
      <div class="apexcharts-tooltip-series-group apexcharts-active" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e0e0e0; padding-top: 4px; margin-top: 4px;">
        <div style="width: 100%; display: flex; justify-content: space-between;">
          <span class="apexcharts-tooltip-text-y-label" style="font-weight: bold;">Total Length (m):</span>
          <span class="apexcharts-tooltip-text-y-value" style="font-weight: bold;">${totalText}</span>
        </div>
      </div>`;

        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
  };

  return (
    <Box sx={{ position: 'relative', '& .apexcharts-menu-icon': { mt: '-20px' } }}>
      <Box sx={{ display: 'flex' }}>
        <FormControlLabel
          control={<Checkbox checked={skipZero} onChange={() => setSkipZero((prev) => !prev)} />}
          label="Empty or zero values skipped"
        />
      </Box>
      <Chart
        type="bar"
        series={series}
        options={chartOptions}
        height={chartOptions.chart.height}
      />
    </Box>
  );
    // return (<Chart type="bar" series={filteredSeries} options={chartOptions} height={chartOptions.chart.height} />);
}
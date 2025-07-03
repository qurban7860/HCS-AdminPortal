import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { Box, FormControlLabel, Checkbox, CircularProgress, Typography } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

LogChartStacked.propTypes = {
  processGraphData: PropTypes.func.isRequired,
  graphLabels: PropTypes.object,
  withEfficiencyLine: PropTypes.bool,
  isLoading: PropTypes.bool,
  producedData: PropTypes.string,
  machineSerialNo: PropTypes.string,
  unitType: PropTypes.oneOf(['Metric', 'Imperial']),
};

export default function LogChartStacked({ processGraphData, graphLabels, withEfficiencyLine = false, isLoading, producedData = '', machineSerialNo, unitType = 'Metric' }) {
  const [skipZero, setSkipZero] = useState(false);
  const [chart, setChart] = useState({ categories: [], series: [] });
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const processedChartData = processGraphData(skipZero);
    if (processedChartData && processedChartData.series.length > 0 && processedChartData.categories.length > 0) {
      setChart(processedChartData);
      setIsChartReady(true);
    } else {
      setChart({ categories: [], series: [] });
      setIsChartReady(false);
    }
  }, [skipZero, processGraphData, unitType]);

  const { categories, series } = chart;
  const unitLabel = unitType === 'Imperial' ? 'in' : 'm';

  const colors = ['#A9E0FC', '#FCB49F', '#1976d2'];

  const chartSeries = useMemo(() => {
    const defaultSeries = series.map(s => ({ ...s, type: 'column', yaxisIndex: 0 }));

    if (!withEfficiencyLine) {
      return defaultSeries;
    }

    return defaultSeries.map((s) =>
      s.name.includes('Efficiency')
        ? { ...s, type: 'line', yaxisIndex: 1 }
        : { ...s, type: 'column', yaxisIndex: 0 }
    );
  }, [series, withEfficiencyLine]);

  const chartOptions = {
    chart: {
      type: withEfficiencyLine ? 'line' : 'bar',
      height: 450,
      stacked: true,
      animations: { 
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    colors,
    ...(withEfficiencyLine && {
      stroke: {
        width: chartSeries.map(s => s.type === 'line' ? 3 : 0),
        curve: 'straight',
      },
      markers: {
        size: chartSeries.map(s => s.type === 'line' ? 4 : 0),
      },
    }),
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
      offsetY: -35,
      style: {
        fontSize: '9px',
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
        text: `${machineSerialNo}${producedData ? `, ${producedData}` : ''}`,
        offsetX: -10,
        offsetY: -12,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: withEfficiencyLine
      ? [
          {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              formatter: (val) => fShortenNumber(val),
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
          {
            opposite: true,
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
              formatter: (v) => `${v.toFixed(0)}%`,
            },
            title: {
              text: '% Efficiency',
              style: { fontSize: '12px', fontWeight: 600 },
            },
          },
        ]
      : {
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            formatter: (val) => fShortenNumber(val),
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
      onItemClick: { toggleDataSeries: false },
    },
    tooltip: {
      followCursor: true,
      // shared: true,
      // intersect: false,
      y: {
        formatter: (val, { seriesIndex, w }) => {
          const label = w?.globals?.seriesNames?.[seriesIndex] || '';
          return label.includes('Efficiency')
            ? `${val.toFixed(2)}%`
            : `${val.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ${unitLabel}`;
        },
      },
      custom: ({ series: tooltipSeries, dataPointIndex, w }) => {
        let tooltipContent = `<div class="apexcharts-theme-light" style="padding: 8px;">`;
        let total = 0;

        tooltipSeries.forEach((s, index) => {
          const legend = w.globals.seriesNames[index];
          const color = w.globals.colors[index];
          const value = s[dataPointIndex];

          const isEfficiency = legend.includes('Efficiency');
          if (!isEfficiency) total += value;

          const valueText = isEfficiency
            ? `${value.toFixed(2)}%`
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
              <span class="apexcharts-tooltip-text-y-label" style="font-weight: bold;">Total Length (${unitLabel}):</span>
              <span class="apexcharts-tooltip-text-y-value" style="font-weight: bold;">${totalText}</span>
            </div>
          </div>`;

        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
  };

  return (
    <Box sx={{ position: 'relative', '& .apexcharts-menu-icon': { mt: '-20px' }, '& .apexcharts-legend-text': { textTransform: 'lowercase !important' } }}>
      <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', mt: -4 }}>
        <FormControlLabel
          control={<Checkbox checked={skipZero} onChange={() => setSkipZero((prev) => !prev)} />}
          label="Empty or zero values skipped"
        />
      </Box>
      {isLoading || (!isChartReady && !isLoading) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350, flexDirection: 'column' }}>
          {isLoading && <CircularProgress />}
          <Typography variant="body1" sx={{ mt: isLoading ? 2 : 0 }} color="text.secondary">
            {isLoading ? 'Loading chart data...' : 'No data available to display the chart.'}
          </Typography>
        </Box>
      ) : (
        <Chart
          type={withEfficiencyLine ? 'line' : 'bar'}
          series={chartSeries}
          options={chartOptions}
          height={chartOptions.chart.height}
        />
      )}
    </Box>
  );
    // return (<Chart type="bar" series={filteredSeries} options={chartOptions} height={chartOptions.chart.height} />);
}
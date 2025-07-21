import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';
import { Box, FormControlLabel, Checkbox, CircularProgress, Typography } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

LogLineBarChart.propTypes = {
  processGraphData: PropTypes.func.isRequired,
  graphLabels: PropTypes.object,
  isLoading: PropTypes.bool,
  producedData: PropTypes.string,
  machineSerialNo: PropTypes.string,
  efficiency: PropTypes.number,
  unitType: PropTypes.oneOf(['Metric', 'Imperial']),
};

export default function LogLineBarChart({
  processGraphData,
  graphLabels,
  isLoading,
  producedData,
  machineSerialNo,
  efficiency,
  unitType = 'Metric',
}) {

  const [skipZero, setSkipZero] = useState(true);
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

  const chartSeries = useMemo(() => series.map((s) => ({
    ...s,
    type: s.name.includes('Efficiency') ? 'line' : 'column',
    yaxisIndex: s.name.includes('Efficiency') ? 1 : 0,
  })), [series]);

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 450,
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
    stroke: {
      width: series.map((s) => (s.name.includes('Efficiency') ? 3 : 0)),
      curve: 'straight',
    },
    markers: {
      size: series.map((s) => (s.name.includes('Efficiency') ? 4 : 0)),
    },
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
        const seriesNames = w.config.series.map(s => s.name);
        const producedIndex = seriesNames.findIndex(name => name.includes('Produced Length'));
        const wasteIndex = seriesNames.findIndex(name => name.includes('Waste Length'));

        if (seriesIndex === wasteIndex) {
          const producedVal = w.config.series[producedIndex]?.data?.[dataPointIndex] || 0;
          const wasteVal = w.config.series[wasteIndex]?.data?.[dataPointIndex] || 0;
          const total = producedVal + wasteVal;
          return total === 0 ? '' : fShortenNumber(total);
        }
        return '';
      },
      offsetY: -15,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
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
    yaxis: [
      {
        ...(efficiency && { max: unitType === 'Imperial' ? efficiency * 39.37 : efficiency }),
        min: 0,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          formatter: (val) => (val && fShortenNumber(val) || 0),
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
        ...(efficiency && { max: unitType === 'Imperial' ? efficiency * 39.37 : efficiency }),
        min: 0,
        title: {
          text: 'Efficiency (%)',
          style: {
            fontSize: '12px',
            fontWeight: 600,
          },
        },
        // labels: {
        //   formatter: (val) => fShortenNumber(val),
        // },
        labels: {
          formatter: (val) => {
            let convertedEfficiency = efficiency;

            if (unitType === 'Imperial') {
              convertedEfficiency = efficiency * 39.37;
            }

            if (!convertedEfficiency || convertedEfficiency === 0) return '0%';

            const percent = (val / convertedEfficiency) * 100;
            return `${percent.toFixed(0)}%`;
          }
        },
        show: !!efficiency,
      }
    ],
    legend: {
      onItemClick: { toggleDataSeries: false },
    },
    tooltip: {
      followCursor: true,
      y: {
        formatter: (val, { seriesIndex, w }) => {
          const label = w?.globals?.seriesNames?.[seriesIndex] || '';
          return label.includes('Efficiency') && val
            ? `${val?.toFixed(2)}%`
            : `${val?.toLocaleString(undefined, {
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
          if (!isEfficiency) total += value || 0;

          const valueText = isEfficiency && value
            ? `${((value / (unitType === 'Imperial' ? efficiency * 39.37 : efficiency)) * 100)?.toFixed(2)}%`
            : value?.toLocaleString(undefined, {
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

        const totalText = total?.toLocaleString(undefined, {
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
        <Chart type='line' series={chartSeries} options={chartOptions} height={chartOptions.chart.height} />
      )}
    </Box>
  );
}

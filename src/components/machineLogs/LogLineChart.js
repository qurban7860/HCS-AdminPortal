/* eslint-disable no-nested-ternary */
// import PropTypes from 'prop-types';
// import { useTheme } from '@mui/material';
// import Chart from '../chart';
// import { fShortenNumber } from '../../utils/formatNumber';

// LogLineChart.propTypes = { chart: PropTypes.object, graphLabels: PropTypes.object };
// export default function LogLineChart({ chart, graphLabels }) {
//   const theme = useTheme();
//   const { categories, series } = chart;
//   const colors = ["#50AB4F", theme.palette.success.main];
//   const menuBackgroundColor = theme.palette.common.white;

//   const menuTextColor = theme.palette.common.black;

//   const chartOptions = {
//     chart: {
//       type: 'line',
//       // height: graphHeight,
//       foreColor: theme.palette.grey[500],
//       toolbar: {
//         show: true,
//         tools: {
//           download: true,
//           selection: false,
//           zoom: false,
//           zoomin: false,
//           zoomout: false,
//           pan: false,
//           reset: true,
//         },
//       },
//       animations: { enabled: false },
//     },
//     responsive: [
//       {
//         breakpoint: 1000,
//         options: {
//           chart: { width: '100%' },
//           legend: { position: 'bottom' },
//         },
//       },
//     ],
//     colors,
//     stroke: {
//       curve: 'straight',
//       width: 3,
//     },
//     // dataLabels: {
//     //   enabled: true,
//     //   formatter(val, { seriesIndex, dataPointIndex, w }) {
//     //     if (seriesIndex === 1) return ''
//     //     return val === 0 ? '' : val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//     //   },
//     //   offsetY: -10,
//     //   style: {
//     //     fontSize: '12px',
//     //     colors: [themeMode === KEY.LIGHT ? theme.palette.grey[800] : theme.palette.grey[400]]
//     //   }
//     // },
//     xaxis: {
//       categories,
//       position: 'bottom',
//       labels: {
//         offsetY: 0,
//         rotate: -45,
//         rotateAlways: true,
//       },
//       axisBorder: { show: false, color: theme.palette.grey[500] },
//       axisTicks: { show: false, color: theme.palette.grey[500] },
//       title: {
//         text: graphLabels?.xaxis,
//         offsetX: 0,
//         offsetY: 0,
//         style: {
//           fontSize: '12px',
//           fontWeight: 600,
//           cssClass: 'apexcharts-xaxis-title',
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: graphLabels?.yaxis,
//         offsetX: 0,
//         offsetY: 0,
//         style: {
//           fontSize: '12px',
//           fontWeight: 600,
//           cssClass: 'apexcharts-yaxis-title',
//           color: theme.palette.grey[500],
//         },
//       },
//       labels: {
//         formatter: (value) =>
//           value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
//         style: { fontSize: '12px', color: theme.palette.grey[800] },
//       },
//     },
//     tooltip: {
//       custom: ({ series: tooltipSeries, seriesIndex, dataPointIndex, w }) => {
//         let tooltipContent = `<div class="apexcharts-theme-light">`;
//         tooltipSeries.forEach((s, index) => {
//           const legend = 'Production Rate: ';
//           const color = w.globals.colors[index];
//           const value = s[dataPointIndex].toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           });
//           tooltipContent += `<div class="apexcharts-tooltip-series-group apexcharts-active" style="order: 1; display: flex;">`;
//           tooltipContent += `<span class="apexcharts-tooltip-marker" style="background-color: ${color};"></span>`;
//           tooltipContent += `<div class="apexcharts-tooltip-text"><div class="apexcharts-tooltip-y-group">`;
//           tooltipContent += `<span class="apexcharts-tooltip-text-y-label">${legend}:</span>`;
//           tooltipContent += `<span class="apexcharts-tooltip-text-y-value">${value}</span></div></div></div>`;
//         });

//         tooltipContent += `</div>`;
//         return tooltipContent;
//       },
//     },
//     legend: {
//       onItemClick: {
//         toggleDataSeries: false,
//       },
//     },
//     grid: {
//       borderColor: theme.palette.grey[400],
//       opacity: 0.3,
//     },
//     markers: {
//       size: 4,
//     },
//     fill: {
//       type: 'gradient',
//     },
//   };

//   return (
//     <>
//       <style>{`
//     .apexcharts-menu {
//       background-color: ${menuBackgroundColor} !important;
//       color: ${menuTextColor} !important;
//       border-radius: 2px;
//       border: 1px solid ${menuBackgroundColor};
//     }
//   `}</style>
//       <Chart
//         type="line"
//         series={series}
//         options={chartOptions}
//         // height={chartOptions.chart.height}
//       />
//     </>
//   );
// }


import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { Box, FormControlLabel, Checkbox, CircularProgress, Typography } from '@mui/material';
import Chart from '../chart';
import { fShortenNumber } from '../../utils/formatNumber';

LogLineBarChart.propTypes = {
  processGraphData: PropTypes.func.isRequired,
  graphLabels: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default function LogLineBarChart({ processGraphData, graphLabels, isLoading }) {
  const [skipZero, setSkipZero] = useState(true);
  const [chartData, setChartData] = useState({ categories: [], series: [] });
  const [isChartReady, setIsChartReady] = useState(false);

  const isProcessGraphData = useCallback(() => processGraphData(skipZero), [processGraphData, skipZero]);

  useEffect(() => {
    const processed = isProcessGraphData();
    if (processed?.series?.length && processed?.categories?.length) {
      setChartData(processed);
      setIsChartReady(true);
    } else {
      setChartData({ categories: [], series: [] });
      setIsChartReady(false);
    }
  }, [isProcessGraphData]);

  const { categories, series } = chartData;

  const colors = ['#A9E0FC', '#FCB49F', '#1976d2'];

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      stacked: true,
      animations: { enabled: false },
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
      width: [0, 0, 3],
      curve: 'straight',
    },
    markers: { size: [0, 0, 4] },
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
      enabledOnSeries: [0],
      formatter(val, { seriesIndex, dataPointIndex, w }) {
        if (seriesIndex !== 0) return '';
        const produced = w.config.series[0]?.data?.[dataPointIndex] || 0;
        const waste = w.config.series[1]?.data?.[dataPointIndex] || 0;
        const total = Number(produced) + Number(waste);
        return total === 0 ? '' : fShortenNumber(total);
      },
      offsetY: -25,
      style: { fontSize: '12px', colors: ['#304758'] },
    },
    xaxis: {
      categories,
      labels: {
        offsetY: 8,
        rotate: -45,
        rotateAlways: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: {
        text: graphLabels?.xaxis,
        offsetX: 0,
        offsetY: -12,
        style: { fontSize: '12px', 
          fontWeight: 600, 
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: [
      {
        labels: {
          formatter: (val) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        title: {
          text: graphLabels?.yaxis,
          offsetX: -5,
          offsetY: 0,
          style: { fontSize: '12px', 
           fontWeight: 600, 
           cssClass: 'apexcharts-xaxis-title',
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
    ],
    legend: {
      onItemClick: { toggleDataSeries: false },
    },
    tooltip: {
      shared: true,
      followCursor: true,
      y: {
        formatter: (val, { seriesIndex, w }) => {
          const seriesName = w?.globals?.seriesNames?.[seriesIndex] || '';
          return seriesName.includes('Efficiency')
            ? `${val.toFixed(2)}%`
            : val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
      },
      custom: ({ series: tooltipSeries, dataPointIndex, w }) => {
        let tooltipContent = `<div class="apexcharts-theme-light" style="padding:8px;">`;
        let total = 0;

        tooltipSeries.forEach((s, i) => {
          const legend = w.globals.seriesNames[i];
          const color = w.globals.colors[i];
          const value = s[dataPointIndex];

          const formattedValue = legend.includes('Efficiency')
            ? `${value.toFixed(2)}%`
            : value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

          if (!legend.includes('Efficiency')) total += value;

          tooltipContent += `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
              <span style="background:${color};width:10px;height:10px;border-radius:50%;margin-right:8px;"></span>
              <span style="flex:1 1 auto;">${legend}</span>
              <span>${formattedValue}</span>
            </div>`;
        });

        tooltipContent += `
          <hr style="border:none;border-top:1px solid #e0e0e0;margin:4px 0;">
          <div style="display:flex;justify-content:space-between;font-weight:bold;">
            <span>Total Length (m)</span>
            <span>${total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</span>
          </div>`;
        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },
  };


  const chartSeries = series.map((s) => {
  if (s.name === 'Efficiency (%)') {
    return { ...s, type: 'line', yaxisIndex: 1 };
  }
  return { ...s, type: 'column', yaxisIndex: 0 };
  });

  return (
    <Box sx={{ position: 'relative', '& .apexcharts-menu-icon': { mt: '-20px' } }}>
      <Box sx={{ display: 'flex' }}>
        <FormControlLabel
          control={<Checkbox checked={skipZero} onChange={() => setSkipZero((prev) => !prev)} />}
          label="Empty or zero values skipped"
        />
      </Box>

      {isLoading || (!isChartReady && !isLoading) ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 350,
            flexDirection: 'column',
          }}
        >
          {isLoading && <CircularProgress />}
          <Typography variant="body1" sx={{ mt: isLoading ? 2 : 0 }} color="text.secondary">
            {isLoading ? 'Loading chart data...' : 'No data available to display the chart.'}
          </Typography>
        </Box>
      ) : (
        <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
      )}
    </Box>
  );
}

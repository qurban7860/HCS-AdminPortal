import PropTypes from 'prop-types';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  BarElement,
  BarController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fShortenNumber } from '../../utils/formatNumber';

ChartJS.register(CategoryScale, LinearScale, LineController, BarElement, BarController, PointElement, LineElement, Title, Tooltip, Legend);

LogLineBarChartv2.propTypes = {
  processGraphData: PropTypes.func.isRequired,
  graphLabels: PropTypes.object,
  isLoading: PropTypes.bool,
  producedData: PropTypes.string,
  machineSerialNo: PropTypes.string,
  efficiency: PropTypes.number,
  unitType: PropTypes.oneOf(['Metric', 'Imperial']),
};

export default function LogLineBarChartv2({
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
  const [anchorEl, setAnchorEl] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const processedChartData = processGraphData(skipZero);
    if (processedChartData?.series.length && processedChartData?.categories.length) {
      setChart(processedChartData);
      setIsChartReady(true);
    } else {
      setChart({ categories: [], series: [] });
      setIsChartReady(false);
    }
  }, [skipZero, processGraphData, unitType]);

  const { categories, series } = chart;
  const unitLabel = unitType === 'Imperial' ? 'in' : 'm';

  const chartData = useMemo(() => {
    const colors = ['#A9E0FC', '#FCB49F', '#1976d2'];
    const barSeries = series.filter((s) => !s.name.includes('Efficiency'));
    const lineSeries = series.filter((s) => s.name.includes('Efficiency'));

    return {
      labels: categories,
      datasets: [
        ...lineSeries.map((s) => ({
          label: s.name,
          data: s.data,
          borderColor: colors[2],
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          type: 'line',
          yAxisID: 'y1',
          order: 0,
          z: 1,
        })),
        ...barSeries.map((s, i) => ({
          label: s.name,
          data: s.data,
          backgroundColor: colors[i],
          borderColor: colors[i],
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          stack: 'lengthStack',
          order: 1,
          z: 0,
        })),
      ],
    };
  }, [series, categories]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        onClick: () => { },
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 10,
          boxWidth: 6,
          boxHeight: 6,
        },
      },
      title: {
        display: true,
        text: `${machineSerialNo}${producedData ? `, ${producedData}` : ''}`,
        align: 'center',
        position: 'bottom',
        padding: { top: 0, bottom: 20 },
        font: { size: 12, weight: 'bold' },
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: (context) => {
          let tooltipEl = document.getElementById('chartjs-tooltip');
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.background = 'white';
            tooltipEl.style.border = '1px solid #ccc';
            tooltipEl.style.borderRadius = '4px';
            tooltipEl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            tooltipEl.style.padding = '8px';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.fontSize = '12px';
            tooltipEl.style.zIndex = 999;
            document.body.appendChild(tooltipEl);
          }

          const { chart: chartInstance, tooltip } = context;
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const dataIndex = tooltip.dataPoints?.[0]?.dataIndex;
          const { datasets } = chartInstance.data;

          const nonEfficiency = datasets.filter((ds) => !ds.label.includes('Efficiency'));
          const efficiencyDataset = datasets.find((ds) => ds.label.includes('Efficiency'));

          let total = 0;
          let html = '<div style="margin-bottom:4px;">';

          nonEfficiency.forEach((ds) => {
            const value = ds.data[dataIndex] || 0;
            total += value;
            html += `
              <div style="display:flex;align-items:center;margin-bottom:4px;">
                <span style="width:12px;height:12px;background:${ds.backgroundColor};border-radius:50%;margin-right:8px;"></span>
                <span style="flex:1;margin-right:8px;">${ds.label}</span>
                <span>${value.toFixed(2)} ${unitLabel}</span>
              </div>
            `;
          });

          if (efficiencyDataset) {
            const efficiencyValue = efficiencyDataset.data[dataIndex];
            const efficiencyPercent = efficiencyValue / (unitType === 'Imperial' ? efficiency * 39.37 : efficiency) * 100;

            html += `
              <div style="display:flex;align-items:center;margin-bottom:4px;">
                <span style="width:12px;height:12px;background:${efficiencyDataset.borderColor};border-radius:50%;margin-right:8px;"></span>
                <span style="flex:1;margin-right:8px;">${efficiencyDataset.label}</span>
                <span>${efficiencyPercent.toFixed(2)}%</span>
              </div>
            `;
          }

          html += `
            <div style="border-top:1px solid #e0e0e0;padding-top:4px;margin-top:4px;display:flex;justify-content:space-between;font-weight:bold;">
              <span>Total Length (${unitLabel}):</span>
              <span>${total.toFixed(2)}</span>
            </div></div>`;

          tooltipEl.innerHTML = html;

          const canvasRect = chartInstance.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = `${canvasRect.left + window.scrollX + tooltip.caretX}px`;
          tooltipEl.style.top = `${canvasRect.top + window.scrollY + tooltip.caretY}px`;
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
        grid: {
          display: false, 
          drawTicks: false, 
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: graphLabels?.yaxis || `Produced and Waste Length (${unitLabel})`,
          font: { size: 12, weight: 'bold' },
        },
        min: 0,
        ...(efficiency && { max: unitType === 'Imperial' ? efficiency * 39.37 : efficiency }),
        ticks: {
          callback: (value) => fShortenNumber(value) || 0,
        },
      },
      ...(efficiency && {
        y1: {
          position: 'right',
          title: {
            display: true,
            text: 'Efficiency (%)',
            font: { size: 12, weight: 'bold' },
          },
          suggestedMin: 0,
          ...(efficiency && { max: unitType === 'Imperial' ? efficiency * 39.37 : efficiency }),
          ticks: {
            callback: (val) => {
              let convertedEfficiency = efficiency;

              if (unitType === 'Imperial') {
                convertedEfficiency = efficiency * 39.37;
              }

              if (!convertedEfficiency || convertedEfficiency === 0) return '0%';

              const percent = (val / convertedEfficiency) * 100;
              return `${percent.toFixed(0)}%`;
            },
          },
          grid: { drawOnChartArea: false },
        },
      }),
    },
    animation: { duration: 0 },
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDownload = (format = 'png') => {
    const chartInstance = chartRef.current;

    if (format === 'csv') {
      if (!chartInstance) return;

      const { data } = chartInstance.config;
      const { labels, datasets } = data;

      const efficiencyDataset = datasets.find((ds) => ds.label.includes('Efficiency'));

      let csvContent = `Category,${  datasets
        .filter(ds => !ds.label.includes('Efficiency'))
        .map(ds => ds.label).join(',')  },Efficiency (%)\n`;

      labels.forEach((label, i) => {
        const row = [label];

      datasets.forEach((ds) => {
        if (!ds.label.includes('Efficiency')) {
          row.push(ds.data[i] != null ? ds.data[i] : '');
        }
      });

      if (efficiencyDataset) {
        const rawValue = efficiencyDataset.data[i];
        const denominator = unitType === 'Imperial' ? efficiency * 39.37 : efficiency;

        const percent = denominator && rawValue != null
          ? (rawValue / denominator) * 100
          : 0;

        row.push(`${percent.toFixed(2)}%`);
      }

      csvContent += `${row.join(',')  }\n`;
    });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `chart.csv`;
      link.click();
    }

    else if (format === 'png' || format === 'jpeg') {
      if (chartInstance) {
        const link = document.createElement('a');
        link.href = chartInstance.toBase64Image(format === 'jpeg' ? 'image/jpeg' : 'image/png');
        link.download = `chart.${format}`;
        link.click();
      }
    }

    handleMenuClose();
  };

  return (
    <Box sx={{ position: 'relative', height: '450px' }}>
      <Box sx={{ position: 'absolute', right: -15, top: -35, zIndex: 1 }}>
        <IconButton onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
          PaperProps={{
            sx: {
              boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
              borderRadius: 1,
              minWidth: 100,
              mt: 1,
              '& .MuiMenuItem-root': {
                fontSize: 12,
              },
            },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <MenuItem onClick={() => handleDownload('png')}>Download PNG</MenuItem>
        <MenuItem onClick={() => handleDownload('jpeg')}>Download JPEG</MenuItem>
        <MenuItem onClick={() => handleDownload('csv')}>Download CSV</MenuItem>
      </Menu>
      </Box>
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
        <Chart ref={chartRef} type="bar" data={chartData} options={chartOptions} />
      )}
    </Box>
  );
}

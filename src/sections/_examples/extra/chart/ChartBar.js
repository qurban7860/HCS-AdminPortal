// components
import PropTypes from 'prop-types';
import Chart, { useChart } from '../../../../components/chart';
// ----------------------------------------------------------------------

ChartBar.propTypes = {
  optionsData: PropTypes.array,
  seriesData: PropTypes.array,
};
export default function ChartBar({ optionsData, seriesData }) {
  const series = [{ name: 'Customers', data: seriesData }];
  const chartOptions = useChart({
    stroke: { show: false },
    plotOptions: {
      bar: { horizontal: true, barHeight: '30%' },
    },
    xaxis: {
      categories: optionsData,
    },
  });

  return <Chart type="bar" series={series} options={chartOptions} height={320} />;
}

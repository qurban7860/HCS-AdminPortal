// components
import PropTypes from 'prop-types';
import Chart, { useChart } from '../chart';
// ----------------------------------------------------------------------

ChartBar.propTypes = {
  type:PropTypes.string,
  height: PropTypes.number,
  optionsData: PropTypes.array,
  seriesData: PropTypes.array,
};
export default function ChartBar({ type, height, optionsData, seriesData}) {

  const minHeight = 320;
  const series = [{ name: 'Machines', data:  seriesData}];
  const chartOptions = useChart({
    stroke: { show: true },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '30%' },
    },
    xaxis: {
      categories: optionsData,
    },
  });
  return <Chart type={type} series={series} options={chartOptions} height={height>minHeight?height:minHeight} />;
}

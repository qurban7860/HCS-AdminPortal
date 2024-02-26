// components
import PropTypes from 'prop-types';
import Chart, { useChart } from '../chart';
// ----------------------------------------------------------------------

ChartBarAutoHeight.propTypes = {
  type:PropTypes.string,
  height: PropTypes.number,
  optionsData: PropTypes.array,
  seriesData: PropTypes.array,
};

export default function ChartBarAutoHeight({ type, height, optionsData, seriesData}) {

  const series = [{ name: 'Machines', data:  seriesData}];
  const chartOptions = useChart({
    stroke: { show: true },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '10px' },
    },
    xaxis: {
      categories: optionsData,
    },
  });
  return <Chart type={type} series={series} options={chartOptions} height={`${((optionsData?.length || 10) * 25) < 500 ? 500 : ((optionsData?.length || 10) * 25)}px`} />;
}

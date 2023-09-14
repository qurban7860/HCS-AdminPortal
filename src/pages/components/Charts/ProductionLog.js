import PropTypes from 'prop-types';
import { useState } from 'react';
import { Card, CardHeader, Box, Divider } from '@mui/material';
import { CustomSmallSelect } from '../../../components/custom-input';
import Chart, { useChart } from '../../../components/chart';
import { StyledBg } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

ProductionLog.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.func,
};

export default function ProductionLog({ title, subheader, chart, ...other }) {
  const { colors, categories, series, options } = chart;
  const [seriesData, setSeriesData] = useState('28-June-2023');

  // let LNFT =  total number produced in a day;
  // let Minutes = total minutes in a day;
  // let LFNTPerMin = LNFT / Minutes;

  const operatorArr = [
    { name: 'Operator 1', data: [5000, 0, 3000, 0, 2000, 0] },
    { name: 'Operator 2', data: [5000, 0, 4000, 0, 3000, 0] },
    { name: 'Operator 3', data: [5500, 0, 2500, 0, 1500, 0] },
  ];

  function displayLFNT() {
    let index = 0;

    setInterval(() => {
      const operator = operatorArr[index];
      const lfnt = operator.data.shift();

      subheader = `${operator.name} - LFNT/Min: ${lfnt}`;

      operator.data.push(lfnt);

      index = (index + 1) % operatorArr.length;
    }, 500);
  }

  const total = operatorArr.reduce((acc, curr) => acc + curr.data, 0);
  const operatorArrPercent = operatorArr.map((item) => item.data / total);
  const operatorArrMax = operatorArrPercent / 285;

  const chartOptions = useChart({
    colors,
    xaxis: {
      categories,
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader="
          Operator 1 - LFNT/Min: 0.017543859649122806"
        action={
          <CustomSmallSelect
            value={seriesData}
            onChange={(event) => setSeriesData(event.target.value)}
          >
            <Divider />
            {series.map((option) => (
              <option key={option.day} value={option.day}>
                {option.day}
              </option>
            ))}
          </CustomSmallSelect>
        }
      />

      {series.map((item) => (
        <Box key={item.day} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.day === seriesData && (
            <Chart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
      <StyledBg />
    </Card>
  );
}

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Card, CardHeader, Box } from '@mui/material';
import { CustomSmallSelect } from '../custom-input';
import Chart, { useChart } from '../chart';
import { StyledBg } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

ProductionLog.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.func,
};

export default function ProductionLog({ title, subheader, chart, ...other }) {
  const { colors, categories, series, options } = chart;
  const [seriesData, setSeriesData] = useState('28-June-2023');

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
        subheader="Operator 1 - LFNT/Min: 0.017543859649122806"
        action={
          <CustomSmallSelect
            value={seriesData}
            onChange={(event) => setSeriesData(event.target.value)}
          >
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

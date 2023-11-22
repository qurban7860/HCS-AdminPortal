import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Stack, Grid, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';
import Chart, { useChart } from '../../../components/chart';

// ----------------------------------------------------------------------

HowickWidgets.propTypes = {
  sx: PropTypes.object,
  chart: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
  notVerifiedTitle: PropTypes.string,
  notVerifiedCount: PropTypes.number,
  connectableTitle: PropTypes.string,
  connectableCount: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default function HowickWidgets({
  title,
  total,
  notVerifiedTitle,
  notVerifiedCount,
  connectableTitle,
  connectableCount,
  icon,
  color = 'primary',
  chart,
  sx,
  ...other
}) {
  const theme = useTheme();

  // const { series, options } = chart;

  const chartOptions = useChart({
    colors: [theme.palette[color].light],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '85%',
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        width:'100%',
        p: 3,
        height:'100%',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        color: 'primary.main',
        bgcolor: 'white',
        ...sx,
      }}
      {...other}
    >
      {/* series={series} */}
      <Chart type="polarArea" series={[0.00]} options={chartOptions} width={86} height={86} />

      <Box sx={{ ml: 3 }}>
       <Grid container flex>
        <Grid item textAlign='right'>
            <Typography variant="h4"> {connectableCount?fNumber(total-connectableCount):fNumber(total)}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.72 }}>
              {title}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem sx={{ m: 1}} />
          <Grid item>
          {notVerifiedTitle && notVerifiedCount && <Typography variant="body2" sx={{ opacity: 0.72 }}>{notVerifiedTitle} : {notVerifiedCount}</Typography>}
          {connectableTitle && connectableCount && <Typography variant="body2" sx={{ opacity: 0.72 }}>{connectableTitle} : {connectableCount}</Typography>}
          </Grid>
        </Grid>
      </Box>

      <Iconify
        icon={icon}
        sx={{
          width: 120,
          height: 120,
          opacity: 0.12,
          position: 'absolute',
          right: theme.spacing(-3),
        }}
      />
    </Stack>
  );
}

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
  title: PropTypes.string,
  total: PropTypes.number,
  notVerified: PropTypes.number,
  connectables: PropTypes.number,
  activeUsers: PropTypes.number,
  onlineUsers: PropTypes.number,
  excludedCustomers: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

export default function HowickWidgets({
  title,
  total,
  notVerified,
  connectables,
  activeUsers,
  onlineUsers,
  excludedCustomers,
  icon,
  chart,
  sx,
  ...other
}) {
  const theme = useTheme();

  const chartOptions = useChart({
    colors: [theme.palette.primary.light],
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
        <Box
          rowGap={0}
          columnGap={1}
          display="grid"
          gridTemplateColumns = '40% 60% 1fr'
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
                boxShadow:"0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)"
              }}
              >
          <Grid item sx={{position:'absolute', height:'100%', opacity:0.8, display:'flex', alignItems:'center', left:10}}>
            <Chart type="polarArea" series={[0.00]} options={chartOptions} width={86} height={86} />
          </Grid>
          <Grid container direction='column' sx={{borderRight:'1px solid #919eab3d',pr:1}} textAlign='right'>
            <Typography variant="h4"> {fNumber(total)}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>{title}</Typography>
          </Grid>
          <Grid container direction='column'>
            {connectables !==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Verified : {total-notVerified}</Typography>}
            {notVerified !==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Not Verified : {notVerified}</Typography>}
            {connectables!==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Decoilers / Kits : {connectables}</Typography>}
            {activeUsers !==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Active : {activeUsers}</Typography>}
            {onlineUsers !==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Online : {onlineUsers}</Typography>}
            {excludedCustomers !==undefined && <Typography variant="body2" sx={{ opacity: 0.7 }}>Exclude Reporting : {excludedCustomers}</Typography>}
          </Grid>
          <Iconify icon={icon} sx={{ width: 120, height: 120, opacity: 0.07, position: 'absolute', right: theme.spacing(-3)}}/>
        </Box>
  );
}

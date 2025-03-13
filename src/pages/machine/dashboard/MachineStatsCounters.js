import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import AnimatedCounter from '../../../components/DashboardWidgets/AnimatedCounter';

export default function MachineStatsCounters({ stats, displayConfig }) {
  const statsEntries = Object.entries(stats).filter(([key, value]) => 
    value !== undefined && value !== null && 
    (displayConfig === null || displayConfig === undefined || displayConfig[key])
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Grid 
        container 
        spacing={3} 
        justifyContent="center" 
        alignItems="center"
      >
        {statsEntries.map(([key, value]) => {
          const config =
            displayConfig && displayConfig[key]
              ? displayConfig[key]
              : {
                  label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
                };
          
          return (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              key={key}
              sx={{ display: 'flex' }}
            >
              <AnimatedCounter 
                value={value} 
                label={config.label}
                sx={{ width: '100%' }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

MachineStatsCounters.propTypes = {
  stats: PropTypes.object.isRequired,
  displayConfig: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  )
}; 
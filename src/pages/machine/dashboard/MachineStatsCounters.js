import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import AnimatedCounter from '../../../components/DashboardWidgets/AnimatedCounter';

export default function MachineStatsCounters({ stats, displayConfig }) {
  const statsEntries = Object.entries(stats).filter(([key, value]) => 
    value !== undefined && value !== null && 
    (displayConfig === null || displayConfig === undefined || displayConfig[key])
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {statsEntries.map(([key, value]) => {
        const config =
          displayConfig && displayConfig[key]
            ? displayConfig[key]
            : {
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
              };
        
        return (
          <Grid item xs={6} sm={4} md={2} key={key}>
            <AnimatedCounter 
              value={value} 
              label={config.label}
            />
          </Grid>
        );
      })}
    </Grid>
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
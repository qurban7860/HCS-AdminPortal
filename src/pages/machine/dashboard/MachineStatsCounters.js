import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import StatCounter, { formatLargeNumber } from '../../../components/StatCounters/StatCounter';
import { STATS_CONFIG } from './constants';

const formatNumber = (statObject, key, useRecordCount) => {
  if (!statObject || typeof statObject.value !== 'number') {
    return '0';
  }

  // If this stat should use recordCount instead of value
  if (useRecordCount) {
    return formatLargeNumber(statObject.recordCount || 0);
  }

  let convertedValue = statObject.value;
  if (key === 'producedLength' || key === 'wasteLength') {
    convertedValue /= 1000; // Convert to meters
  } else if (key === 'productionRate') {
    convertedValue *= 3.6; // (3600/1000) to convert to m/h
  }

  return formatLargeNumber(convertedValue);
};

const deriveComponentStats = (stats) => {
  const derivedStats = { ...stats };
  
  // Derive component stats from length stats
  if (stats.producedLength) {
    derivedStats.producedComponents = stats.producedLength;
  }
  if (stats.wasteLength) {
    derivedStats.wasteComponents = stats.wasteLength;
  }
  
  return derivedStats;
};

export default function MachineStatsCounters({ stats, loadingStates }) {
  // Derive component stats from length stats
  const enrichedStats = deriveComponentStats(stats);
  
  // Derive loading states for component stats
  const enrichedLoadingStates = {
    ...loadingStates,
    producedComponents: loadingStates.producedLength,
    wasteComponents: loadingStates.wasteLength
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Grid 
        container 
        spacing={3} 
        justifyContent="center" 
        alignItems="center"
      >
        {STATS_CONFIG.map(({ key, label, useRecordCount }) => {
          const isLoading = enrichedLoadingStates[key];
          const statObject = enrichedStats[key];

          return (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              lg={2} 
              key={key}
              sx={{ display: 'flex' }}
            >
              <StatCounter
                loading={isLoading}
                label={label}
              >
                {formatNumber(statObject, key, useRecordCount)}
              </StatCounter>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

MachineStatsCounters.propTypes = {
  stats: PropTypes.object.isRequired,
  loadingStates: PropTypes.objectOf(PropTypes.bool).isRequired,
}; 
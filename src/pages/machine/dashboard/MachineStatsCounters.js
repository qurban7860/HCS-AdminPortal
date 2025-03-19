import PropTypes from 'prop-types';
import { Grid, Box } from '@mui/material';
import StatCounter, { formatLargeNumber } from '../../../components/StatCounters/StatCounter';

const formatNumber = (statObject, key) => {
  if (!statObject || typeof statObject.value !== 'number') {
    return '0';
  }

  let convertedValue = statObject.value;
  if (key === 'producedLength' || key === 'wasteLength') {
    convertedValue /= 1000; // Convert to meters
  } else if (key === 'productionRate') {
    convertedValue *= 3.6; // (3600/1000) to convert to m/h
  }

  return formatLargeNumber(convertedValue);
};

export default function MachineStatsCounters({ stats, displayConfig, loadingStates }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Grid 
        container 
        spacing={3} 
        justifyContent="center" 
        alignItems="center"
      >
        {displayConfig.map(({ key, label, showRecordCount }) => {
          const isLoading = loadingStates[key];
          const statObject = stats[key];

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
              <StatCounter
                loading={isLoading}
                label={label}
              >
                {statObject && showRecordCount
                  ? `${statObject.recordCount} / ${formatNumber(statObject, key)}`
                  : formatNumber(statObject, key)}
              </StatCounter>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

MachineStatsCounters.propTypes = {
  displayConfig: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      showRecordCount: PropTypes.bool
    })
  ).isRequired,
  stats: PropTypes.object.isRequired,
  loadingStates: PropTypes.objectOf(PropTypes.bool).isRequired,
}; 
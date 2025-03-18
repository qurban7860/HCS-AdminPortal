import PropTypes from 'prop-types';
import { Grid, Box, Card, Typography, styled } from '@mui/material';

// Styled components
const CounterCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  minHeight: 140,
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CounterValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.2,
}));

const CounterLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.5px',
}));

// Format number with suffix (K for thousands, M for millions) and handle unit conversions
const formatNumber = (value, key) => {
  let convertedValue = value;
  if (key === 'producedLength' || key === 'wasteLength') {
    convertedValue = value / 1000;
  } else if (key === 'productionRate') {
    convertedValue = value * 3.6; // (3600/1000)
  }

  if (convertedValue >= 1000000) {
    return `${(convertedValue / 1000000).toFixed(2)}M`;
  }
  if (convertedValue >= 1000) {
    return `${(convertedValue / 1000).toFixed(0)}K`;
  }
  return convertedValue.toFixed(convertedValue % 1 === 0 ? 0 : 2);
};

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
              <CounterCard>
                <CounterValue variant="h4">{formatNumber(value, key)}</CounterValue>
                <CounterLabel variant="body2">{config.label}</CounterLabel>
              </CounterCard>
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
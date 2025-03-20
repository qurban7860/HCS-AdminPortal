import PropTypes from 'prop-types';
import { Card, Typography, Skeleton, styled } from '@mui/material';

// Styled components
export const CounterCard = styled(Card)(({ theme }) => ({
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

export const CounterValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
  lineHeight: 1.2,
}));

export const CounterLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.5px',
}));

// Skeleton loader for a counter
export const CounterSkeleton = () => (
  <CounterCard>
    <Skeleton variant="text" width="60%" height={60} sx={{ mb: 1.5 }} />
    <Skeleton variant="text" width="80%" height={24} />
  </CounterCard>
);

// Format number with suffix (K for thousands, M for millions)
export const formatLargeNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toFixed(value % 1 === 0 ? 0 : 2);
};

// Main StatCounter component
export default function StatCounter({ value, label, loading, children }) {
  if (loading) {
    return <CounterSkeleton />;
  }

  return (
    <CounterCard>
      <CounterValue variant="h4">
        {children || value}
      </CounterValue>
      <CounterLabel variant="body2">{label}</CounterLabel>
    </CounterCard>
  );
}

StatCounter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
}; 
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, styled } from '@mui/material';

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
  // textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

// Format number with suffix (K for thousands, M for millions)
const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toFixed(value % 1 === 0 ? 0 : 2);
};

export default function AnimatedCounter({ value, label, duration = 1500, sx = {} }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (value === 0) {
      setCount(0);
      return;
    }
    
    let startTime;
    let animationFrameId;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuad = progress * (2 - progress);
      setCount(value * easeOutQuad);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
    
    // eslint-disable-next-line consistent-return
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);
  
  const displayValue = formatNumber(count);
  
  return (
    <CounterCard sx={{ ...sx }}>
      <CounterValue variant="h4">{displayValue}</CounterValue>
      <CounterLabel variant="body2">{label}</CounterLabel>
    </CounterCard>
  );
}

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  duration: PropTypes.number,
  sx: PropTypes.object,
}; 
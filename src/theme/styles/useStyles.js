import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  activeHover: {
    display: 'block',
    padding: '0.5rem',
    shadow: 'none',
    fontSize: '1rem',
    cursor: 'point',
    backgroundColor: 'transparent',
    animationName: 'slideIn',
    animation: 'slideIn 0.3s ease-in-out',
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-in-out',
    easing: 'ease-in-out',
    transition: 'all 0.3s ease-in-out',
  },
}));

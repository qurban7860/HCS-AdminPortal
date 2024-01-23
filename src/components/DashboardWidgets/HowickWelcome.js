import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  color: theme.palette.primary.darker,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

HowickWelcome.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default function HowickWelcome({ title, description, action, img, ...other }) {
  return (
    <StyledRoot {...other}>
      <Stack flexGrow={1} sx={{textAlign: { xs: 'center', md: 'left' }, mb:{ xs:5, md:10 }, mt:{ xs:0, md:5 }}}>
        <Typography  variant="h1">{title}</Typography>
        <Typography variant="body" sx={{opacity: 0.8}}>{description}</Typography>
        {action && action}
      </Stack>
      {img && img}
    </StyledRoot>
  );
}

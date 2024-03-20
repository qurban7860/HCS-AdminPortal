import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Card, Typography, Grid } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

CustomerWidget.propTypes = {
  sx: PropTypes.object,
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.number,
};

export default function CustomerWidget({
  title,
  total,
  icon,
  color = 'primary',
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        // py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        padding: theme.spacing(1),
        display: 'flex',
        ...sx,
      }}
      {...other}
    >
    <Grid container>
      <Grid item xs={12} sm={4} maxWidth={false}>
      <Iconify
        icon={icon}
        sx={{
          mt:0.25,
          mb: -0.25,
          // mb: 3,
          p: 1.5,
          width: 47,
          height: 47,
          borderRadius: '50%',
          color: theme.palette[color].dark,
          ...bgGradient({
            direction: '135deg',
            startColor: `${alpha(theme.palette[color].dark, 0)} 0%`,
            endColor: `${alpha(theme.palette[color].dark, 0.24)} 100%`,
          }),
        }}
      />
      </Grid>
      <Grid item xs={12} sm={8} sx={{mt:1.75}} >

      {/* <Container maxWidth="xl" sx={{ textAlign: 'center' }}> */}
        <Typography variant="subtitle2" align='left' noWrap>
          {title}
        </Typography>
      {/* </Container> */}
      </Grid>
      </Grid>
      </Card>
  );
}

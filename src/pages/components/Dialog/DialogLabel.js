import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Link } from '@mui/material';
import Iconify from '../../../components/iconify';

function DialogLabel({ onClick, content }) {
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        padding: '10px',
      }}
    >
      <Typography variant="h4" sx={{ px: 2 }}>
        {content}
      </Typography>
      <Link onClick={onClick} href="#" underline="none" sx={{ ml: 'auto' }}>
        <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
      </Link>
    </Grid>
  );
}

DialogLabel.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

export default DialogLabel;

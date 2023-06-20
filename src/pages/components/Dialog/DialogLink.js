import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Link } from '@mui/material';
import Iconify from '../../../components/iconify';

function DialogLink({ onClick, content }) {
  return (
    <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
      <Link
        onClick={onClick}
        href="#"
        underline="none"
        sx={{
          ml: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          pb: 3,
        }}
      >
        <Typography variant="body" sx={{ px: 2 }}>
          {content}
        </Typography>
        <Iconify icon="mdi:share" />
      </Link>
    </Grid>
  );
}

DialogLink.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

export default DialogLink;

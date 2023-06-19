import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

function UnderDevelopment() {
  return (
    <Grid container sx={{ justifyContent: 'center' }}>
      <Grid
        item
        sx={{
          opacity: '30%',
          marginTop: '50px',
          height: '40vh',
          display: 'flex',
        }}
      >
        <img src="/assets/illustrations/characters/character_5.png" alt="UNDER CONSTRUCTION" />
      </Grid>
      <Grid
        item
        sx={{
          display: 'block',
          justifyContent: 'center',
          textAlign: 'center',
          width: '50%',
          height: '40vh',
          opacity: '30%',
          position: 'relative',
          margin: '20px',
        }}
      >
        <Typography variant="h1">UNDER DEVELOPMENT..</Typography>
        <Typography variant="body1">
          While we are still working on completing our website, we invite you to check back soon for
          updates. In the meantime, please feel free to contact us directly if you have any
          questions or concerns. We appreciate your patience and understanding during this time, and
          we look forward to serving you better through our new website. Thank you for your interest
          in our company.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default UnderDevelopment;

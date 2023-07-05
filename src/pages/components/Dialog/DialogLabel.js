import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Link, DialogActions, Button } from '@mui/material';
import Iconify from '../../../components/iconify';

function DialogLabel({ onClick, content }) {
  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        height: '50px',
        pt: 1,
      }}
    >
      <Typography variant="h4" sx={{ px: 2 }}>
        {content}
      </Typography>
      <DialogActions>
        <Button onClick={onClick} sx={{ mr: -4 }}>
          <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
        </Button>
      </DialogActions>
    </Grid>
  );
}

DialogLabel.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

export default DialogLabel;

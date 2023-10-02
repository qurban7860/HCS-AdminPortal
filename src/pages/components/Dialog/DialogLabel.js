import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, DialogActions, Button } from '@mui/material';
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
        p: 2,
      }}
    >
      <Typography variant="h4" sx={{ px: 2 }}>
        {content}
      </Typography>
      <DialogActions>
        <Button onClick={onClick} sx={{ mr: -5 }}>
          <Iconify sx={{ color: 'white' }} icon="mdi:close-circle-outline" />
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

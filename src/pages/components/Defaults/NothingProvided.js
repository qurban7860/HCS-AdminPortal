import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';

NothingProvided.propTypes = {
  content: PropTypes.string,
};

function NothingProvided({ content }) {
  return (
    <Grid container item md={12} p={2} justifyContent="center" color="text.disabled">
      <Iconify icon={ICONS.warning} />
      <Typography variant="body1">&nbsp;{content}</Typography>
    </Grid>
  );
}

export default NothingProvided;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

export default function FormLabel({ content }) {
  return (
    <Grid container sx={{ pt: '2rem' }}>
      <Grid
        item
        xs={12}
        sm={12}
        sx={{
          backgroundImage: (theme) =>
            `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
        }}
      >
        <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'white' }}>
          {content}
        </Typography>
      </Grid>
    </Grid>
  );
}

FormLabel.propTypes = {
  content: PropTypes.string,
};

export function AddFormLabel({ content }) {
  return (
    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
      {content}
    </Typography>
  );
}

AddFormLabel.propTypes = {
  content: PropTypes.string,
};

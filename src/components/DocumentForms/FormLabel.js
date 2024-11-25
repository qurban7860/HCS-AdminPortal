import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';

export default function FormLabel({ content, endingContent, variant }) {
  return (
    <Grid container>
      <Grid item xs={12} sm={12}
        sx={{
          backgroundImage: (theme) => `linear-gradient(to right, ${theme.palette.primary.main} ,  #2065d142)`,
          borderRadius:'5px',
          display: 'flex',
          justifyContent: "space-between"
        }}
      >
        <Typography variant={ variant || "h6" } sm={12} sx={{ ml: 1, p:'2px', color: 'white'}}>{content}</Typography>
        { endingContent  && 
          <Typography variant={ variant || "h6" } sm={12} sx={{ mr: 1, p:'2px' }}>{endingContent}</Typography>
        }
      </Grid>
    </Grid>
  );
}

FormLabel.propTypes = {
  content: PropTypes.string,
  endingContent: PropTypes.string,
  variant: PropTypes.string,
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

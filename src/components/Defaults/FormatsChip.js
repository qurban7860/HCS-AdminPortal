import React from 'react';
import { Grid, Chip } from '@mui/material';
import { allowedExtensions } from '../../constants/document-constants';

export default function FormatsChip() {
  return (
    <>
      {allowedExtensions.map((ext, index) => (
        <Grid display="inline-flex" p={0.1}>
          <Chip
            key={index}
            label={ext}
            size="small"
            sx={{color: 'primary.main', cursor:'default'}}
          />
        </Grid>
      ))}
    </>
  );
}

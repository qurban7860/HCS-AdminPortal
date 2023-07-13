import React from 'react';
import { Grid, Chip, alpha } from '@mui/material';
import { allowedExtensions } from '../../../constants/document-constants';

export default function FormatsChip() {
  return (
    <>
      {allowedExtensions.map((ext, index) => (
        <Grid display="inline-flex" p={1}>
          <Chip
            key={index}
            label={ext}
            size="small"
            sx={{
              borderRadius: '50%',
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.25),
              },
            }}
          />
        </Grid>
      ))}
    </>
  );
}

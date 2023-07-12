import React from 'react';
import { Chip, Grid, alpha } from '@mui/material';
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
            clickable
            sx={{
              borderRadius: '50%',
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              ...(index === 1 && {
                color: 'info.main',
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
              }),
              ...(index === 2 && {
                color: 'error.main',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              }),
            }}
          />
        </Grid>
      ))}
    </>
  );
}

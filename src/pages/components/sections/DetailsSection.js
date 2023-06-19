import React from 'react';
import PropTypes from 'prop-types';
import { Stack, CardContent, Typography } from '@mui/material';
import { GridBaseCard2 } from '../../../theme/styles/customer-styles';

function DetailsSection({ content, content2, content3, lg, ...props }) {
  return (
    <GridBaseCard2 item lg={lg} justifyContent="flex-start">
      <CardContent
        component={Stack}
        display="block"
        justifyContent="center"
        height="200px"
        my={{ xs: 0, lg: 2 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {content}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {content2}
        </Typography>
        <Typography variant="overline" color="text.secondary" pt={2}>
          {content3}
        </Typography>
      </CardContent>
    </GridBaseCard2>
  );
}

DetailsSection.propTypes = {
  content: PropTypes.string,
  content2: PropTypes.string,
  content3: PropTypes.string,
  lg: PropTypes.number,
};

export default DetailsSection;

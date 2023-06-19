import React from 'react';
import PropTypes from 'prop-types';
import { CardContent, CardMedia, Stack } from '@mui/material';
import {
  GridBaseCard1,
  CustomAvatarBase,
  CardMediaBase,
} from '../../../theme/styles/customer-styles';

function AvatarSection({ name, image, isSite, ...props }) {
  return (
    <GridBaseCard1 item lg={4} justifyContent="center">
      <CardContent
        component={Stack}
        display="block"
        height="170px"
        sx={{ position: 'relative', zIndex: '1' }}
      >
        {!isSite && <CustomAvatarBase name={name} alt={name} />}

        <CardMediaBase
          component="img"
          image={image}
          alt="customer's contact cover photo was here"
        />
      </CardContent>
    </GridBaseCard1>
  );
}

AvatarSection.propTypes = {
  name: PropTypes.node,
  image: PropTypes.node,
  isSite: PropTypes.bool,
};

export default AvatarSection;

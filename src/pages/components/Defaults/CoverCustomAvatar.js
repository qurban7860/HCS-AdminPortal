import React from 'react';
import PropTypes from 'prop-types';
import { CustomAvatar } from '../../../components/custom-avatar';

function CoverCustomAvatar({ name, children }) {
  return (
    <CustomAvatar
      name={name}
      alt={name}
      sx={{
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'common.white',
        color: '#fff',
        fontSize: '4rem',
        ml: { xs: 3, md: 3 },
        mt: { xs: 1, md: 1 },
        width: { xs: 110, md: 110 },
        height: { xs: 110, md: 110 },
      }}
    >
      {children}
    </CustomAvatar>
  );
}

CoverCustomAvatar.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
};

export default CoverCustomAvatar;

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import { fDate } from '../../utils/formatTime';
import {allowedExtensions} from '../../constants/document-constants';

export default function AllowedExtensionsMenuePopover({open, onClose}) {
  return (
    <MenuPopover open={open} onClose={onClose} arrow='bottom-left' sx={{ p: 0, maxWidth:'900px'  }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">Allowed Extensions</Typography>
              <Divider sx={{ borderStyle: 'solid' }} />

                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 3 }}>
          {allowedExtensions?.join(', ')}
                </Typography>
        </Box>
      </Box>
    </MenuPopover>
  );
}
AllowedExtensionsMenuePopover.propTypes = {
    open: PropTypes.object,
    onClose: PropTypes.func,
  };


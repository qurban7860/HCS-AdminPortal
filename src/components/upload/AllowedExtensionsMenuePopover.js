import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider,Typography } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormatsChip from '../Defaults/FormatsChip';

export default function AllowedExtensionsMenuePopover({ open, onClose, imagesOnly }) {
  return (
    <MenuPopover open={open} onClose={onClose} arrow="bottom-left" sx={{ p:0, maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p:2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">Allowed Formats</Typography>
          <Divider sx={{ borderStyle: 'solid', my:0.5 }} />
          <FormatsChip imagesOnly={imagesOnly} />
        </Box>
      </Box>
    </MenuPopover>
  );
}
AllowedExtensionsMenuePopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  imagesOnly: PropTypes.bool,
};

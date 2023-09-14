import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider,Typography } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormatsChip from '../../pages/components/Defaults/FormatsChip';

export default function AllowedExtensionsMenuePopover({ open, onClose }) {
  return (
    <MenuPopover open={open} onClose={onClose} arrow="bottom-left" sx={{ p: 0, maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">Allowed Formats: </Typography>
          <Divider sx={{ borderStyle: 'solid' }} />
          <FormatsChip />
        </Box>
      </Box>
    </MenuPopover>
  );
}
AllowedExtensionsMenuePopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
};

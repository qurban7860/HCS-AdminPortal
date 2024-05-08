import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography, Chip } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import { fDate } from '../../utils/formatTime';

function ChipInPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} arrow='top-right' sx={{ p: 0, maxWidth:"400px" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{ListTitle}</Typography>
          <Divider  sx={{ borderStyle: 'solid', mb:1 }} />
          {ListArr?.map(( el ) => (<Chip label={el?.defaultName || "" } sx={{m:0.2}} />))}
        </Box>
      </Box>
    </MenuPopover>
  );
}
export default memo(ChipInPopover)

ChipInPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

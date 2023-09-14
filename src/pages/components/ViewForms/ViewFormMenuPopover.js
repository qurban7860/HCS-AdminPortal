import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography } from '@mui/material';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { fDate } from '../../../utils/formatTime';

export default function ViewFormMenuPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{ListTitle}</Typography>

          {ListArr?.map((user) => (
            <Grid key={user?._id} >
              <Divider  sx={{ borderStyle: 'solid' }} />
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 3 }}>
                  {user?.verifiedBy?.name || ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {fDate(user?.verifiedDate) || ''}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </MenuPopover>
  );
}

ViewFormMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

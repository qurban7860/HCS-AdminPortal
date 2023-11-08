import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography } from '@mui/material';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import { fDate } from '../../../utils/formatTime';

function ViewFormHistoricalPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{ListTitle}</Typography>
          {ListArr?.map((history) => (
            <Grid key={history?._id} >
              <Divider  sx={{ borderStyle: 'solid' }} />
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 3 }}>
                  <b>Value:</b> {history?.checkItemValue || ''}
                </Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <b>Comment: </b> {history?.comments || ''}
                </Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 3 }}>
                <b>Created By: </b>{history?.createdBy?.name || ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <b>Created At: </b>{fDate(history?.createdAt) || ''}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </MenuPopover>
  );
}
export default memo(ViewFormHistoricalPopover)
ViewFormHistoricalPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

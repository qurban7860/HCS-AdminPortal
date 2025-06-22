import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Link } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import { fDate } from '../../utils/formatTime';

function ContactUsersPopover({ open, onClose, onViewUser }) {

  const { contactUsers } = useSelector((state) => state.user);

  return (
    <MenuPopover arrow="top-right" open={open} onClose={onClose} sx={{ p: 0, mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">Contact Users</Typography>
          {contactUsers?.map((user) => (
              <Grid 
                key={user?._id} 
                display="flex" 
                justifyContent="space-between" 
                gap={3}
                sx={{ borderTop: '1px solid #E0E0E0', py: 0.5 }}
              >
                <Link onClick={() => onViewUser(user)} variant="body2" href="#" underline="none">
                  {user?.name || ''}
                </Link>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user?.email || ''}
                  {/* {fDate(user?.createdAt) || ''} */}
                </Typography>
              </Grid>
          ))}
        </Box>
      </Box>
    </MenuPopover>
  );
}
export default memo(ContactUsersPopover)
ContactUsersPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  onViewUser: PropTypes.func,
};

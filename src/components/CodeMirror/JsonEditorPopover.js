import React from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Typography } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';

export default function JsonEditorPopover({ open, onClose }) {

const currentDate = new Date();
const formattedDate = currentDate.toISOString();

const jsonObject = {
  date: formattedDate
};

const jsonArray = [
  { date: formattedDate }, 
  { date: formattedDate },
  { date: formattedDate }
];

  return (
    <MenuPopover open={open} onClose={onClose} arrow="top-right" sx={{ p:0, maxWidth: '900px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p:2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">
            <pre>{JSON.stringify(jsonObject, null, 2 )}</pre>
            <Divider sx={{ borderStyle: 'solid', my: 0.5 }} />
            <pre>{JSON.stringify(jsonArray, null, 2 )}</pre>
          </Typography>
        </Box>
      </Box>
    </MenuPopover>
  );
}
JsonEditorPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
};

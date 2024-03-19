import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDate, fDateTime } from '../../utils/formatTime';
import ViewFormField from './ViewFormField';

function ViewFormCodeMenuPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ width: 250 }}>
        <ViewFormField  chips={ListArr} />
    </MenuPopover>
  );
}

export default memo(ViewFormCodeMenuPopover);

ViewFormCodeMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

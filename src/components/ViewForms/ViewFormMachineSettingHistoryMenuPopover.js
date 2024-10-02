import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDateTime } from '../../utils/formatTime';

function ViewFormMachineSettingHistoryMenuPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0, width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '40vw' } }}> 
      <Box sx={{ py: 1, px: 1, width: '100%' }} alignContent="center" alignItems="center" >
        <FormLabel content={ListTitle} />
        <TableContainer component={Paper} >
          <Table size="small" aria-label="a dense table" >
            <TableHead>
              <TableRow>
                <TableCell align='left' >Value</TableCell>
                <TableCell align='left' >Updated By</TableCell>
                <TableCell align='right' >Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ListArr?.map((m) => (
                <TableRow key={m?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell align='left'  sx={{ wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: 200 }}>{m?.techParamValue || ''}</TableCell>
                  <TableCell align='left'>{m?.updatedBy?.name || ''}</TableCell>
                  <TableCell align='right'>{fDateTime(m?.updatedAt) || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MenuPopover>
  );
}


export default memo(ViewFormMachineSettingHistoryMenuPopover);

ViewFormMachineSettingHistoryMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

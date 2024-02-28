import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDate } from '../../utils/formatTime';

function ViewFormTransferHistoryMenuPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0 }}>
      <Box sx={{ py: 1, px: 1 }} alignContent="center" alignItems="center" >
        <FormLabel content={ListTitle} />
        <TableContainer component={Paper} >
          <Table size="small" aria-label="a dense table" >
            <TableHead>
              <TableRow>
                {/* <TableCell align='left' >Serial No</TableCell> */}
                <TableCell align='left' >Transferred Date</TableCell>
                <TableCell align='left' >Transferred to Customer</TableCell>
                <TableCell align='left' >Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ListArr?.map((m) => (
                <TableRow key={m?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  {/* <TableCell align='left' component="th" scope="row" >{m?.serialNo || ''}</TableCell> */}
                  <TableCell align='left'>{fDate(m?.transferredDate) || ''}</TableCell>
                  <TableCell align='left'>{m?.customer?.name || ''}</TableCell>
                  <TableCell align='left'>{m?.status?.name || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MenuPopover>
  );
}

export default memo(ViewFormTransferHistoryMenuPopover);

ViewFormTransferHistoryMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

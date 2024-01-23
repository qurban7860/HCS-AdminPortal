import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Divider, Grid, TableCell, TableRow, Typography, TableContainer, Table, Paper, TableHead, TableBody } from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import { fDate } from '../../utils/formatTime';

function ViewFormHistoricalPopover({ open, onClose, ListArr, ListTitle }) {

  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0, maxWidth: 400 }}>
    <TableContainer component={Paper}>
    <Table size='small' aria-label="simple table" >
      <TableHead>
        <TableRow>
          <TableCell>Value</TableCell>
          <TableCell>Created By</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {ListArr?.map((history, index) => (
        <>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
            <TableCell>{history?.checkItemValue || ''}</TableCell>
            <TableCell>{history?.createdBy?.name || ''}</TableCell>
            <TableCell>{fDate(history?.createdAt) || ''}</TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell colSpan={100}>{history?.comments || ''}</TableCell>
          </TableRow>
        </>
        ))}
      </TableBody>
      </Table>
    </TableContainer>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{ListTitle}</Typography>
          {ListArr?.map((history) => (
            <Grid key={history?._id} >
              <Divider  sx={{ borderStyle: 'solid' }} />
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{  mr: 3 }}>
                  <b>Value:</b> {history?.checkItemValue || ''}
                </Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" >
                  <b>Comment: </b> {history?.comments || ''}
                </Typography>
              </Grid>
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ mr: 3 }}>
                <b>Created By: </b>{history?.createdBy?.name || ''}
                </Typography>
                <Typography variant="body2" >
                  <b>Created At: </b>{fDate(history?.createdAt) || ''}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box> */}
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

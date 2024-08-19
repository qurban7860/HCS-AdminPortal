import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDateTime } from '../../utils/formatTime';
import { StyledTooltip } from '../../theme/styles/default-styles';

function ViewFormServiceRecordApprovalPopover({ open, onClose, ListArr, ListTitle }) {
  return (
    <MenuPopover open={open} onClose={onClose} sx={{ p: 0 }}>
      <Box sx={{ py: 1, px: 1 }} alignContent="center" alignItems="center">
        <FormLabel content={ListTitle} />
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Evaluated By</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Comments
                </TableCell>
                <TableCell align="right">Evaluation Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ListArr?.map((m) => (
                <TableRow key={m?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">{m?.status}</TableCell>
                  <TableCell align="left">
                    {`${m?.evaluatedBy?.firstName} ${m?.evaluatedBy?.lastName}` || ''}
                  </TableCell>
                  <StyledTooltip
                    title={m?.comments || ''}
                    placement="bottom"
                    disableFocusListener
                    tooltipcolor="#1976d2"
                    color="#1976d2"
                    PopperProps={{
                      sx: {
                        '& .MuiTooltip-tooltip': {
                          maxWidth: '500px',
                        },
                      },
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>{m?.comments || ''}</span>
                    </TableCell>
                  </StyledTooltip>
                  <TableCell align="right">{fDateTime(m?.evaluationDate) || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MenuPopover>
  );
}

export default memo(ViewFormServiceRecordApprovalPopover);

ViewFormServiceRecordApprovalPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  ListArr: PropTypes.array,
  ListTitle: PropTypes.string,
};

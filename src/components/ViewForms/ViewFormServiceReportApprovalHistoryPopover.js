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
  Paper
} from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDateTime } from '../../utils/formatTime';
import { StyledTooltip } from '../../theme/styles/default-styles';

function ViewFormServiceReportApprovalPopover({ open, onClose, ListTitle, evaluationHistory }) {
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
              {evaluationHistory?.length > 0
                ? evaluationHistory?.map((item) => (
                    <TableRow
                      key={item?._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="left">{item?.status}</TableCell>
                      <TableCell align="left">
                        {item?.updatedBy?.name || ''}
                      </TableCell>
                      <StyledTooltip
                        title={item?.comments || ''}
                        placement="right"
                        disableFocusListener
                        tooltipcolor="#1976d2"
                        color="#1976d2"
                        sx={{ maxWidth: '1000px' }}
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
                          <span>{item?.comments || ''}</span>
                        </TableCell>
                      </StyledTooltip>
                      <TableCell align="right">{fDateTime(item?.updatedAt) || ''}</TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MenuPopover>
  );
}

export default memo(ViewFormServiceReportApprovalPopover);

ViewFormServiceReportApprovalPopover.propTypes = {
  open: PropTypes.object,
  evaluationHistory: PropTypes.array,
  onClose: PropTypes.func,
  ListTitle: PropTypes.string,
};

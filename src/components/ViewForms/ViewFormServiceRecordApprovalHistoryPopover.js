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
  Divider,
  Chip
} from '@mui/material';
import MenuPopover from '../menu-popover/MenuPopover';
import FormLabel from '../DocumentForms/FormLabel';
import { fDateTime } from '../../utils/formatTime';
import { StyledTooltip } from '../../theme/styles/default-styles';

function ViewFormServiceRecordApprovalPopover({ open, onClose, ListTitle, evaluationHistory }) {
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
                    <React.Fragment key={item._id}>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Divider>
                            <Chip label={`Version ${item?.versionNo}`} size="small" />
                          </Divider>
                        </TableCell>
                      </TableRow>
                      {item.logs?.length > 0 ? (
                        item.logs.map((log) => (
                          <TableRow
                            key={log?._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="left">{log?.status}</TableCell>
                            <TableCell align="left">
                              {`${log?.evaluatedBy?.firstName} ${log?.evaluatedBy?.lastName}` || ''}
                            </TableCell>
                            <StyledTooltip
                              title={log?.comments || ''}
                              placement="right"
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
                                <span>{log?.comments || ''}</span>
                              </TableCell>
                            </StyledTooltip>
                            <TableCell align="right">
                              {fDateTime(log?.evaluationDate) || ''}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Not Evaluated
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                : null}
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
  evaluationHistory: PropTypes.array,
  onClose: PropTypes.func,
  ListTitle: PropTypes.string,
};

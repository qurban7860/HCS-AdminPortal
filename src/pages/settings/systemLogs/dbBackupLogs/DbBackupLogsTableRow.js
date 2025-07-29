import PropTypes from 'prop-types';
// @mui
import { TableCell, Typography } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

DbBackupLogsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function DbBackupLogsTableRow({
  row,
  selected,
  onViewRow
}) {
  const { backupSize, databaseName, backupStatus, backupLocation, createdAt } = row
  return (
    <StyledTableRow hover selected={selected} >
      <TableCell align="left"> <Typography variant="body2" > {fDateTime(createdAt)} </Typography> </TableCell>
      <TableCell align="left"> <Typography variant="body2" > {backupLocation} </Typography> </TableCell>
      <TableCell align="left"> <Typography variant="body2" > {`${backupSize?.toFixed(2) || 0} MB`} </Typography> </TableCell>
      <TableCell align="left"> <Typography variant="body2" > {databaseName} </Typography> </TableCell>
      <TableCell align="right"> <Typography variant="body2" > {backupStatus} </Typography> </TableCell>
    </StyledTableRow>
  );
}

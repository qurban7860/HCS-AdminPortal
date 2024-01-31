import PropTypes from 'prop-types';
// @mui
import {
  TableCell
} from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import { StyledTooltip, StyledTableRow } from '../../../../theme/styles/default-styles';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

BlacklistIPListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function BlacklistIPListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { blackListIP, createdBy, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor:'pointer'}} >
      <TableCell align="left"> {blackListIP} </TableCell>
      {/* <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell> */}
      <TableCell align="left"> {createdBy?.name} </TableCell>
      <TableCell align="left" sx={{width:'200px'}}>{fDateTime(createdAt)}</TableCell>
      <TableCell sx={{width:'100px'}} align='right'>
          <StyledTooltip onClick={onDeleteRow} title='Remove IP from Blacklist' placement="top" disableFocusListener tooltipcolor='green'>
            <Iconify icon='zondicons:lock-open' color='green' width="1.7em" sx={{ mb: -0.5, mr: 0.5, cursor:"pointer"}}/>
          </StyledTooltip>
      </TableCell>
    </StyledTableRow>
  );
}

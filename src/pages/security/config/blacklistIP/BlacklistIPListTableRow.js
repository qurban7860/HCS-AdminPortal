import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../../utils/formatTime';
import { StyledTooltip } from '../../../../theme/styles/default-styles';
import Iconify from '../../../../components/iconify';
// components

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

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
      <TableCell align="left" sx={{width:'200px'}}>{fDate(createdAt)}</TableCell>
      <TableCell sx={{width:'100px'}} align='right'>
          <StyledTooltip onClick={onDeleteRow} title='Delete' placement="top" disableFocusListener tooltipcolor='red'>
            <Iconify icon='mdi:trash' color='red' width="1.7em" sx={{ mb: -0.5, mr: 0.5, cursor:"pointer"}}/>
          </StyledTooltip>
      </TableCell>
    </StyledTableRow>
  );
}

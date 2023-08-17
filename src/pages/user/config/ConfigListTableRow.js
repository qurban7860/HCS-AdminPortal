import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
  Chip
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../utils/formatTime';
import { useScreenSize } from '../../../hooks/useResponsive';
// components

// ----------------------------------------------------------------------

ConfigListTableRow.propTypes = {
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

export default function ConfigListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { blockedUsers, blockedCustomers, whiteListIPs, blackListIPs, isActive, createdAt } = row;
  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor:'pointer'}} >
     
      { lgScreen && <TableCell align="left"> {blockedUsers?.map((user)=>(<Chip label={user?.name} sx={{m:0.2, cursor:'pointer'}}/>))} </TableCell>}
      <TableCell align="left"> {blockedCustomers?.map((customer)=>(<Chip label={customer?.name} sx={{m:0.2, cursor:'pointer'}}/>))} </TableCell>
      { smScreen && <TableCell align="left"> {whiteListIPs?.map((wIp)=>(<Chip label={wIp} sx={{m:0.2, cursor:'pointer'}}/>))} </TableCell>}
      { smScreen && <TableCell align="left"> {blackListIPs?.map((bIp)=>(<Chip label={bIp} sx={{m:0.2, cursor:'pointer'}}/>))} </TableCell>}
      <TableCell align="center">
        {' '}
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
      
    </StyledTableRow>
  );
}

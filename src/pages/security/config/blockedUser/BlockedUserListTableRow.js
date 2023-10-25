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
import { fDate } from '../../../../utils/formatTime';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTooltip } from '../../../../theme/styles/default-styles';
import Iconify from '../../../../components/iconify';
// components

// ----------------------------------------------------------------------

BlockedUserListTableRow.propTypes = {
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

export default function BlockedUserListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');
  const { blockedUser, isActive, createdBy, createdAt } = row;
  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor:'pointer'}} >
      <TableCell align="left"> {blockedUser?.name} </TableCell>
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

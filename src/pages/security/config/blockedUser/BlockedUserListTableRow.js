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
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
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
    <StyledTableRow hover selected={selected} sx={{cursor:'pointer'}} >
      <LinkTableCell
        align="left"
        onClick={onViewRow}
        param={blockedUser?.name}
      />
      <TableCell align="left"> {blockedUser?.email} </TableCell>
      <TableCell align="left"> {createdBy?.name} </TableCell>
      <TableCell align="left" sx={{width:'200px'}}>{fDate(createdAt)}</TableCell>
      <TableCell sx={{width:'100px'}} align='right'>
          <StyledTooltip onClick={onDeleteRow} title='Unblock User' placement="top" disableFocusListener tooltipcolor='green'>
            <Iconify icon='zondicons:lock-open' color='green' width="1.7em" sx={{ mb: -0.5, mr: 0.5, cursor:"pointer"}}/>
          </StyledTooltip>
      </TableCell>
    </StyledTableRow>
  );
}

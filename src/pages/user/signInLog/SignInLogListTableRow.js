import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import {  fDateTime } from '../../../utils/formatTime';
// components

// ----------------------------------------------------------------------

SignInLogListTableRow.propTypes = {
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

export default function SignInLogListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { loginTime, user, loginIP, logoutTime } = row;


  

  return (
    <StyledTableRow hover selected={selected}>
      
      <TableCell align="left"> {user?.name ? user?.name : ''} </TableCell>
      <TableCell align="left"> {user?.login ? user?.login : ''} </TableCell>
      <TableCell align="left"> {loginIP} </TableCell>

      <TableCell align="left"> {fDateTime(loginTime)} </TableCell>
      <TableCell align="left">{fDateTime(logoutTime)}</TableCell>
      
    </StyledTableRow>
    
  );
}

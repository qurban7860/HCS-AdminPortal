import PropTypes from 'prop-types';
// import { useState } from 'react';
// import { sentenceCase } from 'change-case';
// @mui
import {
  // Switch,
  // Stack,
  // Button,
  TableRow,
  // Checkbox,
  // MenuItem,
  TableCell,
  // IconButton,
  // Link,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import {  fDateTime } from '../../../utils/formatTime';
import { useScreenSize } from '../../../hooks/useResponsive';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';

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
  const { loginTime, user, loginIP, logoutTime, statusCode } = row;
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={user?.name} />
        { useScreenSize('lg') && <TableCell align="left"> {user?.login ? user?.login : ''} </TableCell>}
        { useScreenSize('lg') && <TableCell align="left"> {loginIP} </TableCell>}
        <TableCell align="left"> {fDateTime(loginTime)} </TableCell>
        <TableCell align="left">{fDateTime(logoutTime)}</TableCell>
        { useScreenSize('sm') && <TableCell align="left" sx={{color: statusCode===200?"green":"red"}}> 
          {`${statusCode===200?"Success":"Failed"}`} 
        </TableCell>}
      </StyledTableRow>
  );
}

import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

RoleListTableRow.propTypes = {
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

export default function RoleListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, roleType, isActive, createdAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      
      <LinkTableCell align="left" onClick={onViewRow} param={name} />
      <TableCell align="left"> {roleType} </TableCell>
      <TableCell align="center">
        {' '}
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
      
    </StyledTableRow>
      
  );
}

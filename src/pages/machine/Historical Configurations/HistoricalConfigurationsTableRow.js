import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  Checkbox,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

HistoricalConfigurationsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  selectedLength: PropTypes.number,
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

export default function HistoricalConfigurationsTableRow({
  row,
  style,
  selected,
  selectedLength,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { backupid, isActive, createdAt, createdBy } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={ onSelectRow }  />
        </TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={backupid} />
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDateTime(createdAt)}</TableCell>
      </StyledTableRow>
  );
}

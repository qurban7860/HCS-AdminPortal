import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

CheckItemListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function CheckItemListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { name, isRequired, inputType, category,  isActive, updatedAt } = row;


 const smScreen = useScreenSize('sm')

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} />
        {smScreen && <TableCell align="left">{inputType}</TableCell>}
        {smScreen && <TableCell align="left">{category?.name}</TableCell>}
        {smScreen && <TableCell align="center">
          {' '}
          <Switch checked={isRequired} disabled size="small" />{' '}
        </TableCell>}
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="right">{fDate(updatedAt)}</TableCell>
      </StyledTableRow>

  );
}

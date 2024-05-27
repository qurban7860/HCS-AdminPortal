import PropTypes from 'prop-types';
// @mui
import { TableCell, Chip } from '@mui/material';
// utils
import { fDate, fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineJiraTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  selectedLength: PropTypes.number,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function MachineJiraTableRow({
  row,
  style,
  selected,
  selectedLength,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { id, self, key, fields, expand } = row;

  const getStatusColor=(color)=>{
    if(color === 'blue-gray'){
      return 'bluegray';
    }
    if(color === 'green'){
      return 'lightgreen';
    }
    if( color === 'yellow'){
      return 'lightyellow';
    }
    return '';
  }
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{fDateTime(fields?.created) || ''}</TableCell>
        <LinkTableCell align="left" onClick={() => onViewRow( key )} param={key || ''} />
        <TableCell align="left">{fields?.summary || ''}</TableCell>
        <TableCell align="left">{fields?.status?.statusCategory?.name && <Chip sx={{ bgcolor: getStatusColor(fields?.status?.statusCategory?.colorName) }} label={fields?.status?.statusCategory?.name || ''} />}</TableCell>
      </StyledTableRow>
  );
}

import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ReleasesListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ReleasesListTableRow({
  row,
  selected,
  onViewRow
}) {
  
  const { name, startDate, releaseDate, released, description  } = row;

  return (
      <StyledTableRow hover selected={selected}>
        { ( released && description ) ? <LinkTableCell align="left" param={name} onClick={onViewRow} />
        : <TableCell align="left" >{name}</TableCell>}
        <TableCell>{fDate(startDate)}</TableCell>
        <TableCell>{fDate(releaseDate)}</TableCell>
        <TableCell align="center">{released && <Switch checked={released} disabled size="small" /> || '' }</TableCell>
      </StyledTableRow>
  );
}

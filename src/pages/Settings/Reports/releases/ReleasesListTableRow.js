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
  
  const { name, startDate, releaseDate, released  } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={name} onClick={onViewRow} />
        <TableCell>{fDate(startDate)}</TableCell>
        <TableCell>{fDate(releaseDate)}</TableCell>
        <TableCell align="center"><Switch checked={released} disabled size="small" /></TableCell>
      </StyledTableRow>
  );
}

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
      <StyledTableRow hover selected={selected} style={{ display: 'block' }}  >
        { ( released && description ) ? <LinkTableCell align="left" param={`Name: ${name}`} onClick={onViewRow} />
        : <TableCell align="left" sx={{ display: 'flex' }} ><b>Name: </b>{name}</TableCell>}
        <TableCell sx={{ display: 'flex' }} ><b>Start Date: </b>{fDate(startDate)}</TableCell>
        <TableCell sx={{ display: 'flex' }} ><b>Release Date: </b>{fDate(releaseDate)}</TableCell>
        <TableCell align="center" sx={{ display: 'flex' }} ><b>Is Released: </b>{released && <Switch checked={released} disabled size="small" /> || '' }</TableCell>
        <TableCell ><b>Description: </b>{description}</TableCell>
      </StyledTableRow>
  );
}

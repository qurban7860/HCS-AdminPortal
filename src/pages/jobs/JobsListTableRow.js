import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles'
// import Iconify from '../../components/iconify';
// import { ICONS } from '../../constants/icons/default-icons';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

JobsListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function JobsListTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { measurementUnit, profile, frameset, version, status, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={measurementUnit} />
      <TableCell align='left' > {profile} </TableCell> 
      <TableCell align='left' > {frameset} </TableCell>
      <TableCell align='left' > {version} </TableCell>
      <TableCell align='left' > {status} </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
 
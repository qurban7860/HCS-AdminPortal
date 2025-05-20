import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import { StyledTableRow } from '../../../../theme/styles/default-styles';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

APILogsSummaryTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};


export default function APILogsSummaryTableRow({
  row,
  style,
  selected,
  onViewRow,
}) {

  const { serialNo, count, lastCallTime } = row;

  return (
    <StyledTableRow hover selected={selected} sx={{cursor:'pointer'}} >
      <LinkTableCell align="left" onClick={() => onViewRow(row)} param={serialNo} />
      <TableCell align="left"> {count} </TableCell>
      <TableCell align="left" sx={{width:'200px'}}>{fDateTime(lastCallTime)}</TableCell>
    </StyledTableRow>
  );
}

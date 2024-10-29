import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell, Typography, Grid, Link } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'
import { fData } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

ApiLogsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ApiLogsTableRow({
  row,
  selected,
  onViewRow
}) {
  const { createdAt } = row
  return (
      <StyledTableRow hover selected={selected} >
          <TableCell align="left"> <Typography variant="body2" > {fDateTime(createdAt)} </Typography> </TableCell>
      </StyledTableRow>
  );
}

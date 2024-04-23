import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell, Typography, Grid, Link } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

Pm2LogsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function Pm2LogsTableRow({
  row,
  selected,
  onViewRow
}) {
  return (
      <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          <TableCell align="left" sx={{ pb: 1, 
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word' }} > <Typography variant="body2" > {row} </Typography> </TableCell>
      </StyledTableRow>
  );
}

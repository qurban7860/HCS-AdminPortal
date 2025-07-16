import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../../utils/formatTime';
import { StyledTooltip, StyledTableRow } from '../../../../theme/styles/default-styles';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import Iconify from '../../../../components/iconify';
// components

// ----------------------------------------------------------------------

WhitelistIPListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function WhitelistIPListTableRow({ row, style, selected, onSelectRow, onDeleteRow, onEditRow, onViewRow }) {
  const { whiteListIP, createdBy, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{ cursor: 'pointer' }}>
      <LinkTableCell align="left" onClick={onViewRow} param={whiteListIP} />
      {/* <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell> */}
      <TableCell align="left"> {createdBy?.name} </TableCell>
      <TableCell align="left" sx={{ width: '200px' }}>
        {fDateTime(createdAt)}
      </TableCell>
      <TableCell sx={{ width: '100px' }} align="right">
        <StyledTooltip onClick={onDeleteRow} title="Remove IP from Whitelist" placement="top" disableFocusListener tooltipcolor="red">
          <Iconify icon="zondicons:lock-open" color="red" width="1.7em" sx={{ mb: -0.5, mr: 0.5, cursor: 'pointer' }} />
        </StyledTooltip>
      </TableCell>
    </StyledTableRow>
  );
}

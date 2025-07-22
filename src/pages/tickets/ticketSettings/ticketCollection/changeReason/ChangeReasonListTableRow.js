import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { StyledTableRow, StyledTooltip} from '../../../../../theme/styles/default-styles';
import Iconify from '../../../../../components/iconify';
import { ICONS } from '../../../../../constants/icons/default-icons';
import { isValidColor, normalizeColor } from '../utils/constant';
import LinkTableCell from '../../../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

ChangeReasonListTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ChangeReasonListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const { name, icon, color, slug, displayOrderNo, isActive, isDefault, updatedAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left" padding="checkbox"  >
        <StyledTooltip
          placement="top" 
          title={ isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
          disableFocusListener tooltipcolor={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} 
          color={ isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
          >
          <Iconify icon={ isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon } sx={{mt: 1}} />
        </StyledTooltip>
      </TableCell>
      <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault}/>
      <TableCell align="left">{slug}</TableCell>
      <TableCell align="left">{displayOrderNo}</TableCell>
      <TableCell align="left" padding="checkbox">
        <StyledTooltip 
          placement="top" 
          title={name || ''} 
          tooltipcolor={color} >
          <Iconify icon={icon} color={isValidColor(normalizeColor(color)) ? normalizeColor(color) : 'black'} />
        </StyledTooltip>
      </TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );
}

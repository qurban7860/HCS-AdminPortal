import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../../../../theme/styles/default-styles'
import Iconify from '../../../../../components/iconify';
import { ICONS } from '../../../../../constants/icons/default-icons';
import LinkTableCell from '../../../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

ChangeTypeListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ChangeTypeListTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { name, icon, color, slug, displayOrderNo, isActive, isDefault, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left" padding="checkbox"  >
        <StyledTooltip
          placement="top" 
          title={ isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
          disableFocusListener tooltipcolor={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} 
          color={ isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
          >
          <Iconify icon={ isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon }/>
        </StyledTooltip>
      </TableCell>
      <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault}/>
      <TableCell align='left' > {slug} </TableCell> 
      <TableCell align='left' > { displayOrderNo} </TableCell>
      <TableCell align="left" padding="checkbox">
        <StyledTooltip 
          placement="top" 
          title={name || ''} 
          tooltipcolor={color} >
          <Iconify icon={icon} color={color} style={{ width: 25, height: 25 }}  />
        </StyledTooltip>
      </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
 
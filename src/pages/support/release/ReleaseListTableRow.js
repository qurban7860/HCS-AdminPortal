import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles'
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

ReleaseListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ReleaseListTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { isActive, name, releaseNo, project, createdAt } = row;
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
      <LinkTableCell align="left" onClick={onViewRow} param={releaseNo} />
      <LinkTableCell align="left" onClick={onViewRow} param={name} />
      <TableCell align='left' > { project?.name } </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
 
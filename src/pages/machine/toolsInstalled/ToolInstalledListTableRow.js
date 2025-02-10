import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
  Switch,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ToolInstalledListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};


export default function ToolInstalledListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    tool: {
      name
    },
      toolType,
      isActive,
      updatedAt
  } = row;

  const smScreen = useScreenSize('sm')
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={name} onClick={onViewRow} />
        { smScreen && <TableCell align="left">{toolType}</TableCell>}
        <TableCell align="center">
          <Switch checked={isActive} disabled size="small" />
        </TableCell>
        <TableCell align="right">{fDate(updatedAt)}</TableCell>
      </StyledTableRow>

  );
}

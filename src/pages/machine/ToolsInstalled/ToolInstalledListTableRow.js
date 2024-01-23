import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Switch,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ToolInstalledListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

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
      createdAt
  } = row;

  const smScreen = useScreenSize('sm')
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={name} onClick={onViewRow} />
        { smScreen && <TableCell align="left">{toolType}</TableCell>}
        <TableCell align="center">
          <Switch checked={isActive} disabled size="small" />
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}

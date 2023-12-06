import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled, } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import IconTooltip from '../../components/Icons/IconTooltip';
import { StyledStack } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

DrawingListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  disabledActions: PropTypes.bool
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function DrawingListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  disabledActions
}) {
  const {
    document,
    documentType,
    documentCategory,
    isActive,
    createdAt,
  } = row;

  const smScreen = useScreenSize('sm')
  
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell>{document?.referenceNumber}</TableCell>
        <LinkTableCell param={document?.displayName} onClick={onViewRow} />
        <TableCell>{document?.stockNumber}</TableCell>
        { smScreen && <TableCell>{documentType?.name}</TableCell>}
        { smScreen && <TableCell>{documentCategory?.name}</TableCell>}
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
        <TableCell align="center">
          <StyledStack>
              <IconTooltip title="Delete" disabled={disabledActions} onClick={onDeleteRow} 
                           color={disabledActions?"#c3c3c3":"#FF0000"} icon="mdi:trash-can-outline" />
          </StyledStack>
        </TableCell>
      </StyledTableRow>
  );
}

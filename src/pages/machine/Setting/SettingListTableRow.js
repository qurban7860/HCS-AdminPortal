import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'
// ----------------------------------------------------------------------

SettingListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function SettingListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    techParam: {
      name,
      category,
    },
    techParamValue,
    createdAt
  } = row;
  const smScreen = useScreenSize('sm')
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={category?.name||""} onClick={onViewRow} />
        <TableCell align="left">{name||""}</TableCell>
        <TableCell align="left">{techParamValue || ""}</TableCell>
        { smScreen && <TableCell align="right">{fDate(createdAt)}</TableCell>}
      </StyledTableRow>

  );
}

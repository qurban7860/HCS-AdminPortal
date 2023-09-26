import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

SettingListTableRow.propTypes = {
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

export default function SettingListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    techParam: {
      name,
      category,
      description,
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

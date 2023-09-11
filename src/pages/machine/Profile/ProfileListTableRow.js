import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled, alpha, useTheme } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ProfileListTableRow.propTypes = {
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

export default function ProfileListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    defaultName,
    names,
    height,
    width,
    isActive,
    createdAt,
  } = row;

  const profilesString = names.join(', ');
  const smScreen = useScreenSize('sm')

  return (
    <>
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={defaultName} onClick={onViewRow} />
        { smScreen && <TableCell align="left">{profilesString}</TableCell>}
        { smScreen && <TableCell align="left">{height}X{width}</TableCell>}
        <TableCell align="right">{fDate(createdAt)}</TableCell>
  
      </StyledTableRow>

    </>
  );
}

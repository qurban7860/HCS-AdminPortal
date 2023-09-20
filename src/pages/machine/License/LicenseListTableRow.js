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

LicenseListTableRow.propTypes = {
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

export default function LicenseListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    licenseKey,
    createdAt,
    licenseDetail: {
      version,
      type,
      extensionTime,
    },
  } = row;
  const smScreen = useScreenSize('sm')

  return (
      <StyledTableRow hover selected={selected}>
        
        <LinkTableCell align="left" param={licenseKey} onClick={onViewRow} />
        { smScreen && <TableCell align="left">{version}</TableCell>}
        { smScreen && <TableCell align="left">{type}</TableCell>}
        <TableCell align="right">{fDate(extensionTime)}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
  
      </StyledTableRow>

  );
}

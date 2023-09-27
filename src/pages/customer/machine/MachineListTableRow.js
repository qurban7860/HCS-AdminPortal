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
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';

MachineListTableRow.propTypes = {
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

export default function MachineListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    name,
    serialNo,
    machineModel,
    instalationSite
  } = row;

  const address = {};
  address.city = instalationSite?.address?.city;
  address.region = instalationSite?.address?.region;
  address.country = instalationSite?.address?.country;

  return (
      <StyledTableRow hover selected={selected}>
        
        <LinkTableCell align="left" param={serialNo} onClick={onViewRow} />
        <TableCell>{name}</TableCell>
        <TableCell>{machineModel?.name}</TableCell>
        <TableCell>
            {Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : ''))
                          .filter((value) => value !== '').join(', ')}
        </TableCell>
  
      </StyledTableRow>

  );
}

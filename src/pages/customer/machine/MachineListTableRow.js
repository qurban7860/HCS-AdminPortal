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
import IconTooltip from '../../components/Icons/IconTooltip';
import LinkTableCellButtons from '../../components/ListTableTools/LinkTableCellButtons';

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onMoveMachine: PropTypes.func
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
  onMoveMachine,
}) {
  const {
    serialNo,
    name,
    machineModel,
    instalationSite
  } = row;

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');
  const address = {};

  address.country = instalationSite?.address?.country;
  address.region = instalationSite?.address?.region;
  address.city = instalationSite?.address?.city;

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={serialNo} onClick={ onViewRow} />
        <TableCell>{name}</TableCell>
        <TableCell>{machineModel?.name}</TableCell>
        <TableCell>
            {Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : ''))
                          .filter((value) => value !== '').join(', ')}
        </TableCell>
        <LinkTableCellButtons moveIcon align="center" onClick={isSuperAdmin && onMoveMachine} />
      </StyledTableRow>

  );
}

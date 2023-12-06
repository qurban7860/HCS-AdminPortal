import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
// components
import LinkTableCellButtons from '../../components/ListTableTools/LinkTableCellButtons';
import LinkDialogTableCellTargetBlank from '../../components/ListTableTools/LinkDialogTableCellTargetBlank';

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onClick: PropTypes.func,
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
  onClick,
  onMoveMachine,
}) {
  const {
    serialNo,
    name,
    machineModel,
    status,
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
        <LinkDialogTableCellTargetBlank align="left" param={serialNo} onViewRow={onViewRow} onClick={onClick} />
        <TableCell>{name || ''}</TableCell>
        <TableCell>{machineModel?.name || ''}</TableCell>
        <TableCell sx={{color:row?.status?.slug==='transferred'?'red':''}}>{status?.name || ''}</TableCell>
        <TableCell>
            {Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : ''))
                          .filter((value) => value !== '').join(', ')}
        </TableCell>
        <LinkTableCellButtons moveIcon align="center" onClick={row?.status?.slug!=='transferred' && isSuperAdmin && onMoveMachine} />
      </StyledTableRow>

  );
}

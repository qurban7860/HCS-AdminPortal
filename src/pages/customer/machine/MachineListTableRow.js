import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
} from '@mui/material';
// utils
// components
import LinkTableCellButtons from '../../../components/ListTableTools/LinkTableCellButtons';
import LinkDialogTableCellTargetBlank from '../../../components/ListTableTools/LinkDialogTableCellTargetBlank';
import { StyledTableRow } from '../../../theme/styles/default-styles'
import { useAuthContext } from '../../../auth/useAuthContext';
import { fDate } from '../../../utils/formatTime';

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onClick: PropTypes.func,
  onMoveMachine: PropTypes.func
};


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
    instalationSite,
    transferredDate,
    transferredMachine
  } = row;

  const address = {};
  const { isAllAccessAllowed } = useAuthContext()

  address.country = instalationSite?.address?.country;
  address.region = instalationSite?.address?.region;
  address.city = instalationSite?.address?.city;


  return (
      <StyledTableRow hover selected={selected}>
        <LinkDialogTableCellTargetBlank align="left" param={serialNo} onViewRow={onViewRow} onClick={onClick} />
        <TableCell>{name || ''}</TableCell>
        <TableCell>{machineModel?.name || ''}</TableCell>
        <TableCell>
          <span style={{color:row?.status?.slug==='transferred'?'red':''}}>{status?.name || ''}</span>
          {row?.status?.slug ==='transferred' &&
            <>
              {` to `} <span style={{fontWeight:'bold'}}>{transferredMachine?.customer?.name || ''}</span>
              {` on `} {fDate(transferredDate)}
            </>
          }
        </TableCell>
        <TableCell>
            {Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : '')).filter((value) => value !== '').join(', ')}
        </TableCell>
        <LinkTableCellButtons moveIcon align="center" onClick={row?.status?.slug!=='transferred' && isAllAccessAllowed && onMoveMachine} />
      </StyledTableRow>

  );
}

import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
} from '@mui/material';
// utils
// components
import LinkTableCellButtons from '../../../../components/ListTableTools/LinkTableCellButtons';
import LinkDialogTableCellTargetBlank from '../../../../components/ListTableTools/LinkDialogTableCellTargetBlank';
import { StyledTableRow, StyledTooltip } from '../../../../theme/styles/default-styles'
import { useAuthContext } from '../../../../auth/useAuthContext';
import { fDate } from '../../../../utils/formatTime';
import Iconify from '../../../../components/iconify';

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
    transferredToMachine
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
          <span style={{color:row?.status?.slug==='transferred'?'red':''}}>{status?.name || ''} </span>
          {row?.status?.slug ==='transferred' &&
            <StyledTooltip
              title={`${status?.name || ''}${transferredToMachine?.customer?.name?` to ${transferredToMachine?.customer?.name}`:''} on ${fDate(transferredDate)}`}
              placement="top"
              disableFocusListener
              tooltipcolor="#008000" 
              color="#008000"
              sx={{maxWidth:'200px'}}
            >
              <Iconify icon="mdi:info" sx={{position:'relative', bottom:'-5px'}} />
            </StyledTooltip>
          }
        </TableCell>
        <TableCell>
            {Object.values(address ?? {}).map((value) => (typeof value === 'string' ? value.trim() : '')).filter((value) => value !== '').join(', ')}
        </TableCell>
        <LinkTableCellButtons moveIcon align="center" onClick={row?.status?.slug!=='transferred' && isAllAccessAllowed && onMoveMachine || undefined } />
      </StyledTableRow>

  );
}

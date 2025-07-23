import PropTypes from 'prop-types';
import React, { memo, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TableCell, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_SUPPORT } from '../../routes/paths';
import { fDate } from '../../utils/formatTime';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import Iconify from '../../components/iconify';
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';

// ----------------------------------------------------------------------

TicketTableRow.propTypes = {
  row: PropTypes.object,
  hiddenColumns: PropTypes.object,
  prefix: PropTypes.string,
};

function TicketTableRow({
  row,
  hiddenColumns,
  prefix = '',
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ticketNo, customer, machine, issueType, summary, priority, status, createdAt, _id, assignees, reporter } = row;
  const tooltipProps = useMemo(() => ({
  tooltip: {
    sx: {
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #ddd',
      fontSize: '14px',
    },
  },
  arrow: {
    sx: {
      color: '#fff',
    },
  },
}), []);

const isVisible = useCallback((key) => !hiddenColumns?.[key], [hiddenColumns]);

  const tooltipNames = useMemo(
    () => assignees?.map((a) => a.name).join(', ') || '',
    [assignees]
  );

  const onViewRow = useCallback(
    () => navigate(PATH_SUPPORT.supportTickets.view(_id)),
    [_id, navigate]
  );

  const handleCustomerDialog = useCallback(
    (event, id) => {
      event.preventDefault();
      dispatch(getCustomer(id));
      dispatch(setCustomerDialog(true));
    },
    [dispatch]
  );

  const handleMachineDialog = useCallback(
    async (event, machineId) => {
      event.preventDefault();
      dispatch(getMachineForDialog(machineId));
      dispatch(setMachineDialog(true));
    },
    [dispatch]
  );

  const onOpenNewTab = useCallback(
    () => window.open(PATH_SUPPORT.supportTickets.view(ticketNo), '_blank'),
    [ticketNo]
  );
  
  return (
<StyledTableRow hover >
      {isVisible('issueType.name') && (
        <TableCell align="left" padding="checkbox">
            <StyledTooltip placement="top" title={issueType?.name || ''} tooltipcolor={issueType?.color}>
              <Iconify icon={issueType?.icon} color={issueType?.color} onClick={() => onViewRow(ticketNo)} style={{ cursor: 'pointer' }} />
            </StyledTooltip>
        </TableCell>
      )}
        {isVisible('status.name') && (
        <TableCell align="left" padding="checkbox">
            <StyledTooltip placement="top" title={status?.name || ''} tooltipcolor={status?.color}>
            <Iconify icon={status?.icon} color={status?.color} />
          </StyledTooltip>
        </TableCell>
      )}
      {isVisible('priority.name') && (
        <TableCell align="left" padding="checkbox">
            <StyledTooltip placement="top" title={priority?.name || ''} tooltipcolor={priority?.color}>
            <Iconify icon={priority?.icon} color={priority?.color} />
          </StyledTooltip>
        </TableCell>
      )}
      {isVisible('ticketNo') && (
        <LinkTableCellWithIconTargetBlank
          onViewRow={() => onViewRow(ticketNo)}
          onClick={() => onOpenNewTab}
          param={`${prefix || ''} - ${ticketNo || ''}`}
        />
      )}
      {isVisible('summary') && <LinkTableCell align="left" onClick={() => onViewRow(ticketNo)} param={summary || ''} />}
      {isVisible('machine.serialNo') && <LinkTableCell align="left" onClick={(event) => handleMachineDialog(event, row.machine?._id)} param={machine?.serialNo || ''} />}
      {isVisible('machine.machineModel.name') && <TableCell align="left"> {machine?.machineModel?.name || ''} </TableCell>}
      {isVisible('customer.name') && <LinkTableCell onClick={(event) => handleCustomerDialog(event, customer?._id )} align="center" param={customer?.name || ''} />}
      {isVisible('reporter.name') && <TableCell align="left">{reporter?.name || ''}</TableCell>}
      {isVisible('assignees.name.[]')&& (
        <TableCell>
          {assignees?.length > 0 && (
            <Tooltip
              title={tooltipNames}
              placement="left"
              arrow
              componentsProps={tooltipProps}
            >
              <span>{assignees[0]?.name || ''}, ...</span>
            </Tooltip>
          )}
        </TableCell>
      )}

      {isVisible('createdAt') && <TableCell align="right"> {fDate(createdAt)} </TableCell>}
    </StyledTableRow>
  );
}

export default memo(TicketTableRow);

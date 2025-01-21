import { useMemo, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Box, Typography, useTheme, Select, MenuItem } from '@mui/material';
// redux
import { patchTicket, getTicket, deleteTicket, resetTicket } from '../../redux/slices/ticket/tickets';
import { getTicketStatuses, resetTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import Iconify from '../../components/iconify';
import { useAuthContext } from '../../auth/useAuthContext';
import { StyledTooltip } from '../../theme/styles/default-styles';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import TicketComments from './TicketComments';

export default function TicketViewForm() {
  const { ticket, isLoading } = useSelector((state) => state.tickets);
  const { ticketStatuses } = useSelector((state) => state.ticketStatuses);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId } = useAuthContext();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status?.name || '');

  const handleStatusChange = async (event) => {
    const updatedStatus = event.target.value;
    setSelectedStatus(updatedStatus);
  
    try {
      const response = await dispatch(patchTicket({ id, data: { status: updatedStatus } }));
      console.log('Patch Response:', response);
      await dispatch(getTicket(id));
      enqueueSnackbar('Status updated successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update status. Please try again.', { variant: 'error' });
    }
  };
  
  useEffect(() => {
    dispatch(getTicketStatuses());
    return ()=> { 
      dispatch(resetTicketStatuses())
    }
  }, [dispatch]);  

  const onArchive = async () => {
    try {
      await dispatch(deleteTicket(id, true));
      enqueueSnackbar('Ticket Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.supportTickets.root);
      dispatch(resetTicket());
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error('Error:', error);
    }
  };
  
  const handleEdit = () => {
    navigate(PATH_SUPPORT.supportTickets.edit(ticket._id));
  };

  const defaultValues = useMemo(
    () => ({
      ticketNo: id && ticket?.ticketNo || '',
      customer: id && ticket?.customer?.name || '',
      machine: id && ticket?.machine?.serialNo || '',
      issueType: id && ticket?.issueType?.name || '',
      summary: id && ticket?.summary || '',
      description: id && ticket?.description || '',
      files: id && ticket?.files || '',
      priority: id && ticket?.priority?.name || '',
      status: id && ticket?.status?.name || '',
      impact: id && ticket?.impact?.name || '',
      shareWith: id && ticket?.shareWith,
      changeType: id && ticket?.changeType?.name || '',
      changeReason: id && ticket?.changeReason?.name || '',
      implementationPlan: id && ticket?.implementationPlan || '',
      backoutPlan: id && ticket?.backoutPlan || '',
      testPlan: id && ticket?.testPlan || '',
      investigationReason: id && ticket?.investigationReason?.name || '',
      rootCause: id && ticket?.rootCause || '',
      workaround: id && ticket?.workaround || '',
      createdByFullName: id && ticket?.createdBy?.name || '',
      createdAt: id && ticket?.createdAt || '',
      createdIP: id && ticket?.createdIP || '',
      updatedByFullName: id && ticket?.updatedBy?.name || '',
      updatedAt: id && ticket?.updatedAt || '',
      updatedIP:  id && ticket?.updatedIP || '',
    }),
    [ ticket, id ]
  );

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
            backLink={() => {
              dispatch(resetTicket());
              navigate(PATH_SUPPORT.supportTickets.root);
            }}
            handleEdit={handleEdit}
            onArchive={onArchive}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <ViewFormField isLoading={isLoading} sm={4} heading="Ticket No."
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.issueType?.icon ? (
                    <StyledTooltip
                      placement="top"
                      title={ticket?.issueType?.name}
                      tooltipcolor={ticket.issueType.color}
                    >
                      <Iconify icon={ticket.issueType.icon} style={{ width: 25, height: 25, color: ticket.issueType.color }} />
                    </StyledTooltip>
                  ) : null}
                  <Typography sx={{ marginLeft: 0.5 }}>{` / ${ticket?.ticketNo || ''}`}</Typography>
                </Box>
              }
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Customer" param={defaultValues.customer} />
            <ViewFormField isLoading={isLoading} sm={4} heading="Machine" param={defaultValues.machine} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Summary" param={defaultValues.summary} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Files" param={defaultValues.files} />
            <ViewFormField
              isLoading={isLoading} sm={4} heading="Priority"
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.priority?.icon ? (
                    <Iconify icon={ticket.priority.icon} style={{ width: 25, height: 25, color: ticket.priority.color }} />
                  ) : null}
                  <Typography sx={{ marginLeft: 0.5 }}>{ticket?.priority?.name}</Typography>
                </Box>
              }
            />
            <ViewFormField
              isLoading={isLoading} sm={4} heading="Status"
              param={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {ticket?.status?.icon ? (
                    <Iconify icon={ticket.status.icon} style={{ width: 25, height: 25, color: ticket.status.color }} />
                  ) : null}
                  {/* <Typography sx={{ marginLeft: 0.5 }}>{ticket?.status?.name}</Typography> */}
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    sx={{ marginLeft: 1, fontSize: 12 }}
                    size="small"
                  >
                    {ticketStatuses.map((status) => (
                      <MenuItem key={status._id} value={status.name}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              }
            />
            <ViewFormField isLoading={isLoading} sm={4} heading="Impact" param={defaultValues.impact} />
            {ticket?.issueType?.name === 'Change Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Type" param={defaultValues.changeType} />
                <ViewFormField isLoading={isLoading} sm={4} heading="Change Reason" param={defaultValues.changeReason} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Implementation Plan" param={defaultValues.implementationPlan} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Backout Plan" param={defaultValues.backoutPlan} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Test Plan" param={defaultValues.testPlan} />
              </>
            )}
            {ticket?.issueType?.name === 'Service Request' && (
              <>
                <ViewFormField isLoading={isLoading} sm={6} heading="Investigation Reason" param={defaultValues.investigationReason} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Root Cause" param={defaultValues.rootCause} />
                <ViewFormField isLoading={isLoading} sm={12} heading="Workaround" param={defaultValues.workaround} />
              </>
            )}
            <ViewFormSwitch isLoading={isLoading} sm={12} isActiveHeading="Shared With Organization" isActive={defaultValues.shareWith} />
          </Grid>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
      <Card sx={{ mt: 2 }}>
        <TicketComments ticketData={ticket} currentUser={{ ...user, userId }} />
      </Card>
    </>
  );
}

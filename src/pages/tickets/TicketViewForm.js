import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Box, Typography } from '@mui/material';
// redux
import { deleteTicket, resetTicket } from '../../redux/slices/ticket/tickets';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import PriorityIcon from '../calendar/utils/PriorityIcon';
import IssueTypeIcon from './utils/IssueTypeIcon';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function TicketViewForm() {
  const { ticket, isLoading } = useSelector((state) => state.tickets);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteTicket(ticket?._id));
      navigate(PATH_SUPPORT.root);
      enqueueSnackbar('Ticket archived successfully!');
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
      customer: ticket?.customer?.name || '',
      machine: ticket?.machine?.serialNo || '',
      issueType: ticket?.issueType || '',
      summary: ticket?.summary || '',
      description: ticket?.description || '',
      files: ticket?.files || '',
      priority: ticket?.priority || '',
      status: ticket?.status || '',
      impact: ticket?.impact || '',
      shareWith: ticket?.shareWith || false,
      changeType: ticket?.changeType || '',
      changeReason: ticket?.changeReason || '',
      implementationPlan: ticket?.implementationPlan || '',
      backoutPlan: ticket?.backoutPlan || '',
      testPlan: ticket?.testPlan || '',
      investigationReason: ticket?.investigationReason || '',
      rootCause: ticket?.rootCause || '',
      workaround: ticket?.workaround || '',
      createdBy: ticket?.createdBy || '',
      updatedBy: ticket?.updatedBy || '',
    }),
    [ticket]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={() => {
            dispatch(resetTicket());
            navigate(PATH_SUPPORT.supportTickets.root);
          }}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Customer" param={defaultValues.customer} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Machine" param={defaultValues.machine} />
          <ViewFormField
            isLoading={isLoading} sm={6} heading="Issue Type"
            param={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IssueTypeIcon issueType={defaultValues.issueType} />
                <Typography sx={{ marginLeft: 0.5 }}>{defaultValues.issueType}</Typography>
              </Box>
            }
          />
          <ViewFormField isLoading={isLoading} sm={12} heading="Summary" param={defaultValues.summary} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Files" param={defaultValues.files} />
          <ViewFormField
            isLoading={isLoading} sm={6} heading="Priority"
            param={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PriorityIcon priority={defaultValues.priority} />
                {defaultValues.priority}
              </Box>
            }
          />
          <ViewFormField isLoading={isLoading} sm={6} heading="Status" param={defaultValues.status} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Impact" param={defaultValues.impact} />
          {ticket?.issueType === 'Change Request' && (
            <>
              <ViewFormField isLoading={isLoading} sm={6} heading="Change Type" param={defaultValues.changeType} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Change Reason" param={defaultValues.changeReason} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Implementation Plan" param={defaultValues.implementationPlan} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Backout Plan" param={defaultValues.backoutPlan} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Test Plan" param={defaultValues.testPlan} />
            </>
          )}
          {ticket?.issueType === 'System Incident' && (
            <>
              <ViewFormField isLoading={isLoading} sm={6} heading="Investigation Reason" param={defaultValues.investigationReason} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Root Cause" param={defaultValues.rootCause} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Workaround" param={defaultValues.workaround} />
            </>
          )}
          <ViewFormSwitch isLoading={isLoading} sm={12} isActiveHeading="Share With" isActive={defaultValues.shareWith} />
        </Grid>
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

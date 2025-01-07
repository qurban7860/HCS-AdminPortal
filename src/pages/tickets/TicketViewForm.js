import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// redux
import { deleteTicket } from '../../redux/slices/ticket/tickets';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

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
      shareWith: ticket?.shareWith || '',
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
  
  const visibleFields = useMemo(() => {
    const { issueType } = ticket || {};
    const baseFields = ['customer', 'machine', 'issueType', 'summary', 'description', 'files', 'priority', 'status', 'impact', 'shareWith'];
    if (issueType === 'System Problem' || issueType === 'Service Request') {
      return baseFields;
    }
    if (issueType === 'Change Request') {
      return [...baseFields, 'changeType', 'changeReason', 'implementationPlan', 'backoutPlan', 'testPlan'];
    }
    if (issueType === 'System Incident') {
      return [...baseFields, 'investigationReason', 'rootCause', 'workaround'];
    }
    return []; 
  }, [ticket]);

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={() => navigate(PATH_SUPPORT.supportTickets.root)}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
        <Grid container sx={{ mt: 2 }}>
          {visibleFields.map((field) => (
            <ViewFormField
              key={field}
              isLoading={isLoading}
              sm={6}
              heading={field}
              param={defaultValues[field]}
            />
          ))}
        </Grid>
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

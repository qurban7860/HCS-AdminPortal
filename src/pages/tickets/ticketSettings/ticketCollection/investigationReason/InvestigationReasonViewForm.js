import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../../../../routes/paths';
// components
import { useSnackbar } from '../../../../../components/snackbar';
import { deleteTicketInvestigationReason, resetTicketInvestigationReasons } from '../../../../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function InvestigationReasonViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketInvestigationReason, isLoading } = useSelector((state) => state.ticketInvestigationReasons);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketInvestigationReason?.name || '',
      slug: ticketInvestigationReason?.slug || '',
      icon: ticketInvestigationReason?.icon || '',
      displayOrderNo: ticketInvestigationReason?.displayOrderNo || '',
      description: ticketInvestigationReason?.description || '',
      isDefault: ticketInvestigationReason?.isDefault || false,
      createdByFullName: ticketInvestigationReason?.createdBy?.name || '',
      createdAt: ticketInvestigationReason?.createdAt || '',
      createdIP: ticketInvestigationReason?.createdIP || '',
      updatedByFullName: ticketInvestigationReason?.updatedBy?.name || '',
      updatedAt: ticketInvestigationReason?.updatedAt || '',
      updatedIP: ticketInvestigationReason?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketInvestigationReason]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketInvestigationReason(id));
      navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);
    } catch (err) {
      enqueueSnackbar('investigation Reason Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.investigationReasons.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketInvestigationReasons());
          navigate(PATH_SUPPORT.ticketSettings.investigationReasons.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={defaultValues?.icon} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Slug" param={defaultValues?.slug} />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Display Order No."
          param={defaultValues?.displayOrderNo?.toString()}
        />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormSwitch isLoading={isLoading} sm={12} isActiveHeading="Default" isActive={defaultValues.isDefault} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}

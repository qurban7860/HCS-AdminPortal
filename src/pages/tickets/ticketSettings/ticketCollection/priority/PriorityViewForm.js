import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../../../../routes/paths';
// components
import { useSnackbar } from '../../../../../components/snackbar';
import { deleteTicketPriority, resetTicketPriority } from '../../../../../redux/slices/ticket/ticketSettings/ticketPriorities';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function PriorityViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketPriority, isLoading } = useSelector((state) => state.ticketPriorities);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketPriority?.name || '',
      slug: ticketPriority?.slug || '',
      icon: ticketPriority?.icon || '',
      displayOrderNo: ticketPriority?.displayOrderNo || '',
      description: ticketPriority?.description || '',
      isDefault: ticketPriority?.isDefault || false,
      createdByFullName: ticketPriority?.createdBy?.name || '',
      createdAt: ticketPriority?.createdAt || '',
      createdIP: ticketPriority?.createdIP || '',
      updatedByFullName: ticketPriority?.updatedBy?.name || '',
      updatedAt: ticketPriority?.updatedAt || '',
      updatedIP: ticketPriority?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ticketPriority]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketPriority(id));
      navigate(PATH_SUPPORT.ticketSettings.priorities.root);
    } catch (err) {
      enqueueSnackbar('Priority Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.priorities.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketPriority());
          navigate(PATH_SUPPORT.ticketSettings.priorities.root);
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

import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../../../../routes/paths';
// components
import { useSnackbar } from '../../../../../components/snackbar';
import { deleteTicketStatus, resetTicketStatus } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatuses';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import Iconify from '../../../../../components/iconify';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function StatusViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketStatus, isLoading } = useSelector((state) => state.ticketStatuses);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketStatus?.name || '',
      slug: ticketStatus?.slug || '',
      icon: ticketStatus?.icon || '',
      displayOrderNo: ticketStatus?.displayOrderNo || '',
      description: ticketStatus?.description || '',
      isDefault: ticketStatus?.isDefault || false,
      createdByFullName: ticketStatus?.createdBy?.name || '',
      createdAt: ticketStatus?.createdAt || '',
      createdIP: ticketStatus?.createdIP || '',
      updatedByFullName: ticketStatus?.updatedBy?.name || '',
      updatedAt: ticketStatus?.updatedAt || '',
      updatedIP: ticketStatus?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ticketStatus]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketStatus(id));
      navigate(PATH_SUPPORT.ticketSettings.statuses.root);
    } catch (err) {
      enqueueSnackbar('Status Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.statuses.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketStatus());
          navigate(PATH_SUPPORT.ticketSettings.statuses.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={<Iconify icon={defaultValues?.icon} sx={{ width: 25, height: 25 }} />} />
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



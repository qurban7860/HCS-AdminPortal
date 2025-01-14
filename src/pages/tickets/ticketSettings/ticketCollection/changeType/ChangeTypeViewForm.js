import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../../../../routes/paths';
// components
import Iconify from '../../../../../components/iconify';
import { useSnackbar } from '../../../../../components/snackbar';
import { StyledTooltip } from '../../../../../theme/styles/default-styles'
import { deleteTicketChangeType, resetTicketChangeType } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeTypes';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function ChangeTypeViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketChangeType, isLoading } = useSelector((state) => state.ticketChangeTypes);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketChangeType?.name || '',
      slug: ticketChangeType?.slug || '',
      icon: ticketChangeType?.icon || '',
      displayOrderNo: ticketChangeType?.displayOrderNo || '',
      description: ticketChangeType?.description || '',
      isDefault: ticketChangeType?.isDefault || false,
      createdByFullName: ticketChangeType?.createdBy?.name || '',
      createdAt: ticketChangeType?.createdAt || '',
      createdIP: ticketChangeType?.createdIP || '',
      updatedByFullName: ticketChangeType?.updatedBy?.name || '',
      updatedAt: ticketChangeType?.updatedAt || '',
      updatedIP: ticketChangeType?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ticketChangeType]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketChangeType(id));
      navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
    } catch (err) {
      enqueueSnackbar('Change Type Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.changeTypes.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketChangeType());
          navigate(PATH_SUPPORT.ticketSettings.changeTypes.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} > 
           <Iconify icon={defaultValues?.icon} sx={{ width: 25, height: 25 }} />
          </StyledTooltip> } 
        />
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

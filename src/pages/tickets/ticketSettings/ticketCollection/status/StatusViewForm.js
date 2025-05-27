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
import { StyledTooltip } from '../../../../../theme/styles/default-styles'
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import FilledEditorField from '../../../utils/FilledEditorField';

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
      statusType: ticketStatus?.statusType?.name || '',
      slug: ticketStatus?.slug || '',
      icon: ticketStatus?.icon || '',
      color: ticketStatus?.color || '',
      displayOrderNo: ticketStatus?.displayOrderNo || '',
      description: ticketStatus?.description || '',
      isDefault: ticketStatus?.isDefault,
      isActive: ticketStatus?.isActive,
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

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketStatus(id, true));
      enqueueSnackbar('Status Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.settings.statuses.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Status Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  
  const toggleEdit = () => navigate(PATH_SUPPORT.settings.statuses.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketStatus());
          navigate(PATH_SUPPORT.settings.statuses.root);
        }}
      />               
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Status Type" param={defaultValues?.statusType} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} 
           tooltipcolor={defaultValues?.color}> 
           <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25, color: defaultValues?.color }} />
          </StyledTooltip> } 
        />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Display Order No."
          param={defaultValues?.displayOrderNo?.toString()}
        />
        <ViewFormField isLoading={isLoading} sm={6} heading="Slug" param={defaultValues?.slug} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description"
          node={<FilledEditorField name="description" value={defaultValues.description} minRows={3} isEditor={false} />}
        />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}



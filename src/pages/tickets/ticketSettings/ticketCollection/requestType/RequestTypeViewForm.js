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
import { deleteTicketRequestType, resetTicketRequestType } from '../../../../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import FilledEditorField from '../../../utils/FilledEditorField';

// ----------------------------------------------------------------------

export default function RequestTypeViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketRequestType, isLoading } = useSelector((state) => state.ticketRequestTypes);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketRequestType?.name || '',
      issueType: ticketRequestType?.issueType?.name || '',
      slug: ticketRequestType?.slug || '',
      icon: ticketRequestType?.icon || '',
      color: ticketRequestType?.color || '',
      displayOrderNo: ticketRequestType?.displayOrderNo || '',
      description: ticketRequestType?.description || '',
      isDefault: ticketRequestType?.isDefault || false,
      isActive: ticketRequestType?.isActive || false,
      createdByFullName: ticketRequestType?.createdBy?.name || '',
      createdAt: ticketRequestType?.createdAt || '',
      createdIP: ticketRequestType?.createdIP || '',
      updatedByFullName: ticketRequestType?.updatedBy?.name || '',
      updatedAt: ticketRequestType?.updatedAt || '',
      updatedIP: ticketRequestType?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketRequestType]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketRequestType(id, true));
      enqueueSnackbar('Request Type Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.settings.requestTypes.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Request Type Archive failed!', { variant: `error` } );
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.settings.requestTypes.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketRequestType());
          navigate(PATH_SUPPORT.settings.requestTypes.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Issue Type" param={defaultValues?.issueType} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} 
           tooltipcolor={defaultValues.color} >
           <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25, color: defaultValues.color }} />
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

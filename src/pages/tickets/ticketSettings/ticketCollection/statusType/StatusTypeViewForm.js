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
import { deleteTicketStatusType, resetTicketStatusType } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import Editor from '../../../../../components/editor';

// ----------------------------------------------------------------------

export default function StatusTypeViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketStatusType, isLoading } = useSelector((state) => state.ticketStatusTypes);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketStatusType?.name || '',
      slug: ticketStatusType?.slug || '',
      icon: ticketStatusType?.icon || '',
      color: ticketStatusType?.color || '',
      displayOrderNo: ticketStatusType?.displayOrderNo || '',
      description: ticketStatusType?.description || '',
      isResolved: ticketStatusType?.isResolved || false,
      isDefault: ticketStatusType?.isDefault || false,
      isActive: ticketStatusType?.isActive || false,
      createdByFullName: ticketStatusType?.createdBy?.name || '',
      createdAt: ticketStatusType?.createdAt || '',
      createdIP: ticketStatusType?.createdIP || '',
      updatedByFullName: ticketStatusType?.updatedBy?.name || '',
      updatedAt: ticketStatusType?.updatedAt || '',
      updatedIP: ticketStatusType?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketStatusType]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketStatusType(id, true));
      enqueueSnackbar('Status Type Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.settings.statusTypes.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Status Type Archive failed!', { variant: `error` } );
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.settings.statusTypes.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isResolved={defaultValues.isResolved} 
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketStatusType());
          navigate(PATH_SUPPORT.settings.statusTypes.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} 
          //  tooltipcolor={theme.palette.primary.main} 
          tooltipcolor={defaultValues.color} >
           <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25, color: defaultValues.color }} />
          </StyledTooltip> } 
        />
        <ViewFormField isLoading={isLoading} sm={6} heading="Slug" param={defaultValues?.slug} />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Display Order No."
          param={defaultValues?.displayOrderNo?.toString()}
        />
        <ViewFormField isLoading={isLoading} sm={12} 
          heading="Description" 
          node={<Editor readOnly hideToolbar sx={{ border: 'none', '& .ql-editor': { padding: '0px' } }} value={defaultValues.description} />}
        />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}

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
import { deleteTicketPriority, resetTicketPriority } from '../../../../../redux/slices/ticket/ticketSettings/ticketPriorities';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import Editor from '../../../../../components/editor';

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
      color: ticketPriority?.color || '',
      displayOrderNo: ticketPriority?.displayOrderNo || '',
      description: ticketPriority?.description || '',
      isDefault: ticketPriority?.isDefault,
      isActive: ticketPriority?.isActive,
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

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketPriority(id, true));
      enqueueSnackbar('Priority Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.settings.priorities.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Priority Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.settings.priorities.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketPriority());
          navigate(PATH_SUPPORT.settings.priorities.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" node={
          <StyledTooltip 
            placement="top" 
            title={defaultValues?.name || ''} 
            tooltipcolor={defaultValues?.color} >
            <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25,  color: defaultValues?.color }} />
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

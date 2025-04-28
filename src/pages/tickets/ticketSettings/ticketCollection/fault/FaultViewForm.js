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
import { StyledTooltip } from '../../../../../theme/styles/default-styles';
import { deleteTicketFault, resetTicketFault } from '../../../../../redux/slices/ticket/ticketSettings/ticketFaults';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
// ----------------------------------------------------------------------

export default function FaultViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketFault, isLoading } = useSelector((state) => state.ticketFaults);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketFault?.name || '',
      slug: ticketFault?.slug || '',
      icon: ticketFault?.icon || '',
      color: ticketFault?.color || '',
      displayOrderNo: ticketFault?.displayOrderNo || '',
      description: ticketFault?.description || '',
      isDefault: ticketFault?.isDefault || false,
      isActive: ticketFault?.isActive || false,
      createdByFullName: ticketFault?.createdBy?.name || '',
      createdAt: ticketFault?.createdAt || '',
      createdIP: ticketFault?.createdIP || '',
      updatedByFullName: ticketFault?.updatedBy?.name || '',
      updatedAt: ticketFault?.updatedAt || '',
      updatedIP: ticketFault?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketFault]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketFault(id, true));
      enqueueSnackbar('Change Reason Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.ticketSettings.faults.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Change Reason Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.faults.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketFault());
          navigate(PATH_SUPPORT.ticketSettings.faults.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} 
           tooltipcolor={defaultValues?.color} >
           <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25, color: defaultValues?.color }} />
          </StyledTooltip> } 
        />
        <ViewFormField isLoading={isLoading} sm={6} heading="Slug" param={defaultValues?.slug} />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Display Order No."
          param={defaultValues?.displayOrderNo?.toString()}
        />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}

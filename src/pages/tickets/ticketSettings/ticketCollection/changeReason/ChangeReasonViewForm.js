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
import { deleteTicketChangeReason, resetTicketChangeReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketChangeReasons';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function ChangeReasonViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketChangeReason, isLoading } = useSelector((state) => state.ticketChangeReasons);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketChangeReason?.name || '',
      slug: ticketChangeReason?.slug || '',
      icon: ticketChangeReason?.icon || '',
      displayOrderNo: ticketChangeReason?.displayOrderNo || '',
      description: ticketChangeReason?.description || '',
      isDefault: ticketChangeReason?.isDefault || false,
      createdByFullName: ticketChangeReason?.createdBy?.name || '',
      createdAt: ticketChangeReason?.createdAt || '',
      createdIP: ticketChangeReason?.createdIP || '',
      updatedByFullName: ticketChangeReason?.updatedBy?.name || '',
      updatedAt: ticketChangeReason?.updatedAt || '',
      updatedIP: ticketChangeReason?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketChangeReason]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketChangeReason(id));
      navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
    } catch (err) {
      enqueueSnackbar('Change Reason Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.changeReasons.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketChangeReason());
          navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
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

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
import { deleteTicketImpact, resetTicketImpact } from '../../../../../redux/slices/ticket/ticketSettings/ticketImpacts';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import FilledEditorField from '../../../utils/FilledEditorField';
// ----------------------------------------------------------------------

export default function ImpactViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketImpact, isLoading } = useSelector((state) => state.ticketImpacts);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketImpact?.name || '',
      slug: ticketImpact?.slug || '',
      icon: ticketImpact?.icon || '',
      color: ticketImpact?.color || '',
      displayOrderNo: ticketImpact?.displayOrderNo || '',
      description: ticketImpact?.description || '',
      isDefault: ticketImpact?.isDefault,
      isActive: ticketImpact?.isActive,
      createdByFullName: ticketImpact?.createdBy?.name || '',
      createdAt: ticketImpact?.createdAt || '',
      createdIP: ticketImpact?.createdIP || '',
      updatedByFullName: ticketImpact?.updatedBy?.name || '',
      updatedAt: ticketImpact?.updatedAt || '',
      updatedIP: ticketImpact?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketImpact]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketImpact(id, true));
      enqueueSnackbar('Impacts Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.ticketSettings.impacts.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Impacts Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.impacts.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketImpact());
          navigate(PATH_SUPPORT.ticketSettings.impacts.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
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

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
import { deleteTicketInvestigationReason, resetTicketInvestigationReason } from '../../../../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import { handleError } from '../../../../../utils/errorHandler';
import Editor from '../../../../../components/editor';

// ----------------------------------------------------------------------

export default function InvestigationReasonViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { ticketInvestigationReason, isLoading } = useSelector((state) => state.ticketInvestigationReasons);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketInvestigationReason?.name || '',
      slug: ticketInvestigationReason?.slug || '',
      icon: ticketInvestigationReason?.icon || '',
      color: ticketInvestigationReason?.color || '',
      displayOrderNo: ticketInvestigationReason?.displayOrderNo || '',
      description: ticketInvestigationReason?.description || '',
      isDefault: ticketInvestigationReason?.isDefault,
      isActive: ticketInvestigationReason?.isActive,
      createdByFullName: ticketInvestigationReason?.createdBy?.name || '',
      createdAt: ticketInvestigationReason?.createdAt || '',
      createdIP: ticketInvestigationReason?.createdIP || '',
      updatedByFullName: ticketInvestigationReason?.updatedBy?.name || '',
      updatedAt: ticketInvestigationReason?.updatedAt || '',
      updatedIP: ticketInvestigationReason?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketInvestigationReason]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketInvestigationReason(id, true));
      navigate(PATH_SUPPORT.settings.investigationReasons.root);
      enqueueSnackbar('Investigation Reason Archived Successfully!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Investigation Reason Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.settings.investigationReasons.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetTicketInvestigationReason());
          navigate(PATH_SUPPORT.settings.investigationReasons.root);
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

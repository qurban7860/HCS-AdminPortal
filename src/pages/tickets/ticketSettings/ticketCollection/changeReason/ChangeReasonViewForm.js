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
import { handleError } from '../../../../../utils/errorHandler';
import Editor from '../../../../../components/editor';

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
      color: ticketChangeReason?.color || '',
      displayOrderNo: ticketChangeReason?.displayOrderNo || '',
      description: ticketChangeReason?.description || '',
      isDefault: ticketChangeReason?.isDefault || false,
      isActive: ticketChangeReason?.isActive || false,
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

  const onArchive = async () => {
    try {
      await dispatch(deleteTicketChangeReason(id, true));
      enqueueSnackbar('Change Reason Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.ticketSettings.changeReasons.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Change Reason Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.changeReasons.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
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

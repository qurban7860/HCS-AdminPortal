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
import { deleteTicketIssueType, resetTicketIssueType } from '../../../../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import ViewFormAudit from '../../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

export default function IssueTypeViewForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { ticketIssueType, isLoading } = useSelector((state) => state.ticketIssueTypes);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: ticketIssueType?.name || '',
      slug: ticketIssueType?.slug || '',
      icon: ticketIssueType?.icon || '',
      displayOrderNo: ticketIssueType?.displayOrderNo || '',
      description: ticketIssueType?.description || '',
      isDefault: ticketIssueType?.isDefault || false,
      createdByFullName: ticketIssueType?.createdBy?.name || '',
      createdAt: ticketIssueType?.createdAt || '',
      createdIP: ticketIssueType?.createdIP || '',
      updatedByFullName: ticketIssueType?.updatedBy?.name || '',
      updatedAt: ticketIssueType?.updatedAt || '',
      updatedIP: ticketIssueType?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ticketIssueType]
  );

  const onDelete = () => {
    try {
      dispatch(deleteTicketIssueType(id, true));
      enqueueSnackbar('Issue Type Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
      dispatch(resetTicketIssueType());
    } catch (err) {
      enqueueSnackbar('Issue Type Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.ticketSettings.issueTypes.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => {
          dispatch(resetTicketIssueType());
          navigate(PATH_SUPPORT.ticketSettings.issueTypes.root);
        }}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Icon" param={
          <StyledTooltip 
           placement="top" 
           title={defaultValues?.name || ''} sx={{ '& .MuiTooltip-tooltip': { backgroundColor: '#2065d1', color: '#ffffff' }, '& .MuiTooltip-arrow': { color: '#2065d1'} }}> 
           <Iconify icon={defaultValues?.icon} style={{ width: 25, height: 25, color: '#2065d1' }} />
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

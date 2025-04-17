import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import { StyledTooltip } from '../../theme/styles/default-styles'
import { deleteJob, resetJob } from '../../redux/slices/jobs/jobs';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { handleError } from '../../utils/errorHandler';

// ----------------------------------------------------------------------

export default function IssueTypeViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { Job, isLoading } = useSelector((state) => state.Jobs);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: Job?.name || '',
      slug: Job?.slug || '',
      icon: Job?.icon || '',
      color: Job?.color || '',
      displayOrderNo: Job?.displayOrderNo || '',
      description: Job?.description || '',
      isDefault: Job?.isDefault || false,
      isActive: Job?.isActive || false,
      createdByFullName: Job?.createdBy?.name || '',
      createdAt: Job?.createdAt || '',
      createdIP: Job?.createdIP || '',
      updatedByFullName: Job?.updatedBy?.name || '',
      updatedAt: Job?.updatedAt || '',
      updatedIP: Job?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ Job]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteJob(id, true));
      enqueueSnackbar('Issue Type Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.Settings.Jobs.root);
    } catch (err) {
      enqueueSnackbar( handleError( err ) || 'Issue Type Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.Settings.issueTypes.edit(id));

  return (
  <Grid>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons  
        isDefault={defaultValues.isDefault} 
        isActive={defaultValues.isActive}
        handleEdit={toggleEdit} 
        onArchive={onArchive} 
        backLink={() => {
          dispatch(resetJob());
          navigate(PATH_SUPPORT.Settings.issueTypes.root);
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
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  </Grid>
  );
}


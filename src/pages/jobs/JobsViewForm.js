import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_SUPPORT } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { deleteJob, resetJob } from '../../redux/slices/jobs/jobs';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { handleError } from '../../utils/errorHandler';

// ----------------------------------------------------------------------

export default function JobsViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { Job, isLoading } = useSelector((state) => state.Jobs);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      measurementUnit: Job?.measurementUnit || '',
      profile: Job?.profile || '',
      frameset: Job?.frameset || '',
      version: Job?.version || '',
      components: Job?.components || [],
      createdByFullName: Job?.createdBy?.name || '',
      createdAt: Job?.createdAt || '',
      createdIP: Job?.createdIP || '',
      updatedByFullName: Job?.updatedBy?.name || '',
      updatedAt: Job?.updatedAt || '',
      updatedIP: Job?.updatedIP || '',
    }),
    [Job]
  );

  const onArchive = async () => {
    try {
      await dispatch(deleteJob(id, true));
      enqueueSnackbar('Job Archived Successfully!', { variant: 'success' });
      navigate(PATH_SUPPORT.Settings.Jobs.root);
    } catch (err) {
      enqueueSnackbar(handleError(err) || 'Job Archive failed!', { variant: 'error' });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => navigate(PATH_SUPPORT.Settings.issueTypes.edit(id));

  return (
    <Grid>
      <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons
          handleEdit={toggleEdit}
          onArchive={onArchive}
          backLink={() => {
            dispatch(resetJob());
            navigate(PATH_SUPPORT.Settings.issueTypes.root);
          }}
        />
        <Grid container sx={{ mt: 2 }}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Measurement Unit" param={defaultValues.measurementUnit} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Profile" param={defaultValues.profile} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Frameset" param={defaultValues.frameset} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Version" param={defaultValues.version} />
          <ViewFormField
            isLoading={isLoading}
            sm={12}
            heading="Components"
            param={defaultValues.components.map((c) => c.name || c).join(', ') || '-'}
          />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

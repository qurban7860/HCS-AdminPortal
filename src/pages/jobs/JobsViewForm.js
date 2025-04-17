import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_JOBS } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { updateJobField, deleteJob, resetJob } from '../../redux/slices/jobs/jobs';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { handleError } from '../../utils/errorHandler';
import FilledTextField from '../tickets/utils/FilledTextField';

// ----------------------------------------------------------------------

export default function JobsViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      measurementUnit: job?.measurementUnit || '',
      profile: job?.profile || '',
      frameset: job?.frameset || '',
      version: job?.version || '',
      components: job?.components || [],
      createdByFullName: job?.createdBy?.name || '',
      createdAt: job?.createdAt || '',
      createdIP: job?.createdIP || '',
      updatedByFullName: job?.updatedBy?.name || '',
      updatedAt: job?.updatedAt || '',
      updatedIP: job?.updatedIP || '',
    }),
    [job]
  );
  
  const onSubmit = async (fieldName, value) => {
    try {
      await dispatch(updateJobField(job?._id, fieldName, value));
      enqueueSnackbar(`Job updated successfully!`, { variant: 'success' });
      } catch (error) {
      enqueueSnackbar(`Job update failed!`, { variant: 'error' });
      throw error
    }
  };
    
  const onArchive = async () => {
    try {
      await dispatch(deleteJob(id, true));
      enqueueSnackbar('Job Archived Successfully!', { variant: 'success' });
      navigate(PATH_JOBS.machineJobs.root);
    } catch (err) {
      enqueueSnackbar(handleError(err) || 'Job Archive failed!', { variant: 'error' });
      console.log('Error:', err);
    }
  };

  return (
    <Grid>
      <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons
          onArchive={onArchive}
          backLink={() => {
            dispatch(resetJob());
            navigate(PATH_JOBS.machineJobs.root);
          }}
        />
        <Grid container sx={{ mt: 2 }}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Measurement Unit"
            node={<FilledTextField name="measurementUnit" value={defaultValues.measurementUnit} onSubmit={onSubmit} />}
          />
           <ViewFormField isLoading={isLoading} sm={6} heading="Profile"
            node={<FilledTextField name="profile" value={defaultValues.profile} onSubmit={onSubmit} />}
          />
           <ViewFormField isLoading={isLoading} sm={6} heading="Frameset"
            node={<FilledTextField name="frameset" value={defaultValues.frameset} onSubmit={onSubmit} />}
          />
           <ViewFormField isLoading={isLoading} sm={6} heading="Version"
            node={<FilledTextField name="version" value={defaultValues.version} onSubmit={onSubmit} />}
          />
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

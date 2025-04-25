import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Grid,
  TableCell,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import { PATH_JOBS } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import { updateJobField, deleteJob, resetJob } from '../../redux/slices/jobs/jobs';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import FilledTextField from '../tickets/utils/FilledTextField';
import { handleError } from '../../utils/errorHandler';

export default function JobsViewForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { job, isLoading } = useSelector((state) => state.jobs);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      csvVersion: job?.csvVersion || '',
      unitOfLength: job?.unitOfLength || '',
      profileName: job?.profileName || '',
      profileDescription: job?.profileDescription || '',
      frameset: job?.frameset || '',
      components: Array.isArray(job?.components) ? job.components : [],
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
      throw error;
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

  const toggleEdit = () => navigate(PATH_JOBS.machineJobs.edit(id));

  return (
    <Grid>
      <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons
          handleEdit={toggleEdit}
          onArchive={onArchive}
          backLink={() => {
            dispatch(resetJob());
            navigate(PATH_JOBS.machineJobs.root);
          }}
        />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <ViewFormField
            isLoading={isLoading}
            sm={6}
            heading="CSV Version"
            param={defaultValues.csvVersion}
            // node={<FilledTextField name="csvVersion" value={defaultValues.csvVersion} onSubmit={onSubmit} />}
          />
          <ViewFormField
            isLoading={isLoading}
            sm={6}
            heading="Unit of Length"
            param={defaultValues.unitOfLength}
            // node={<FilledTextField name="unitOfLength" value={defaultValues.unitOfLength} onSubmit={onSubmit} />}
          />
          <ViewFormField
            isLoading={isLoading}
            sm={6}
            heading="Frameset"
            param={defaultValues.frameset}
            // node={<FilledTextField name="frameset" value={defaultValues.frameset} onSubmit={onSubmit} />}
          />
          <ViewFormField
            isLoading={isLoading}
            sm={6}
            heading="Profile Name"
            param={defaultValues.profileName}
            // node={<FilledTextField name="profileName" value={defaultValues.profileName} onSubmit={onSubmit} />}
          />
          <ViewFormField
            isLoading={isLoading}
            sm={12}
            heading="Profile Description"
            param={defaultValues.profileDescription}
            // node={<FilledTextField name="profileDescription" value={defaultValues.profileDescription} onSubmit={onSubmit}  minRows={4}  />}
          />

          {/* Components Table */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Components
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Label Direction</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>Shape</TableCell>
                  <TableCell>Web</TableCell>
                  <TableCell>Flange</TableCell>
                  <TableCell>Thickness</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Positions</TableCell>
                  <TableCell>Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {defaultValues.components.map((comp, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].label`}
                        value={comp.label}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].labelDirection`}
                        value={comp.labelDirection}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].quantity`}
                        value={comp.quantity}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].length`}
                        value={comp.length}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].profileShape`}
                        value={comp.profileShape}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].webWidth`}
                        value={comp.webWidth}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].flangeHeight`}
                        value={comp.flangeHeight}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].materialThickness`}
                        value={comp.materialThickness}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      <FilledTextField
                        name={`components[${i}].materialGrade`}
                        value={comp.materialGrade}
                        onSubmit={onSubmit}
                      />
                    </TableCell>
                    <TableCell>
                      {comp.positions
                        ? `(${comp.positions.startX}, ${comp.positions.startY}) → (${comp.positions.endX}, ${comp.positions.endY})`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {comp.operations?.length
                        ? comp.operations
                            .map((op) => `${op.operationType} @ ${op.offset}`)
                            .join(', ')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Card>
    </Grid>
  );
}

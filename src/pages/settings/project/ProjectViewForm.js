import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import {
  archiveProject,
  deleteProject,
  restoreProject,
} from '../../../redux/slices/support/project/project';
// paths
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { handleError } from '../../../utils/errorHandler';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

export default function ProjectViewForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { project, isLoading } = useSelector((state) => state.project);

  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'project_prefix')?.value?.trim() || ''; 


  const onDelete = async () => {
    try {
      await dispatch(deleteProject(project?._id));
      enqueueSnackbar('Project deleted successfully!');
      navigate(PATH_SETTING.projects.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveProject(project?._id));
      enqueueSnackbar('Project archived successfully!');
      navigate(PATH_SETTING.projects.archived);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreProject(project?._id));
      navigate(PATH_SETTING.projects.root);
      enqueueSnackbar('Project restored successfully!');
    } catch (error) {
      enqueueSnackbar('Project restored failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.projects.edit(project._id));
  };

  const defaultValues = useMemo(
    () => ({
      projectNo: `${prefix}-${project?.projectNo}` || '',
      name: project?.name || '',
      startDate: project?.startDate || null,
      endDate: project?.endDate || null,
      description: project?.description || '',
      customerAccess: project?.customerAccess,
      isActive: project?.isActive,
      createdAt: project?.createdAt || '',
      createdByFullName: project?.createdBy?.name || '',
      createdIP: project?.createdIP || '',
      updatedAt: project?.updatedAt || '',
      updatedByFullName: project?.updatedBy?.name || '',
      updatedIP: project?.updatedIP || '',
      isArchived: project?.isArchived,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project]
  );

  const handlebackLink = () => {
    if(defaultValues.isArchived){
      navigate(PATH_SETTING.projects.archived);
    }else{
      navigate(PATH_SETTING.projects.root);
    }
  };

  return (
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
              customerAccess={defaultValues?.customerAccess}
              isDefault={defaultValues.isDefault}
              isActive={defaultValues.isActive}
              isPrimary={defaultValues.isPrimaryDrawing}
              {...(!defaultValues?.isArchived && { handleEdit })}
              {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
              {...(defaultValues?.isArchived && { onRestore })}
              backLink={handlebackLink}
              settingPage
            />
            <Grid container sx={{ mt: 2 }}>
              <ViewFormField isLoading={isLoading} sm={6} heading="Project Key" param={defaultValues.projectNo} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues.name} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Start Date" param={fDate(defaultValues?.startDate)} />
              <ViewFormField isLoading={isLoading} sm={6} heading="End Date" param={fDate(defaultValues?.endDate)} />
              <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
          </Grid>
        </Card>
  );
}

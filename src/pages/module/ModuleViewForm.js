import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import {  Card, Grid, Tooltip } from '@mui/material';
// redux
import { deleteModule } from '../../redux/slices/module/module';
import {  PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ModuleViewForm() {
  const { module } = useSelector((state) => state.module);
console.log("module",module);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
       dispatch(deleteModule(module._id));
      enqueueSnackbar('Module deleted successfully!', { variant: 'success' });
      navigate(PATH_SETTING.modules.list);
    } catch (error) {
      const errorMessage = error.message || 'Something went wrong!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error:', error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.modules.edit(module._id));
  };

  const defaultValues = useMemo(
    () => ({
      name: module?.name,
      description: module?.description,
      isActive: module?.isActive,
      createdAt: module?.createdAt || '',
      createdByFullName: module?.createdBy?.name || '',
      createdIP: module?.createdIP || '',
      updatedAt: module?.updatedAt || '',
      updatedByFullName: module?.updatedBy?.name || '',
      updatedIP: module?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [module]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
        <Grid display="inline-flex">
          <Tooltip>
            <ViewFormField isActive={defaultValues.isActive} />
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={12} heading="Name" param={defaultValues.name} />
          {/* <ViewFormField sm={12} heading="Value" param={defaultValues.value} /> */}
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />

          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

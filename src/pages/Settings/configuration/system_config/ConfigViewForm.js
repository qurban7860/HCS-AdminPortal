import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import { deleteConfig } from '../../../../redux/slices/config/config';
// paths
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
// import { fDate, fDateTime } from '../../utils/formatTime';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ConfigViewForm() {
  const { config, isLoading } = useSelector((state) => state.config);
  const isSuperAdmin = JSON.parse(localStorage.getItem('userRoles'))?.some((role) => role.roleType === 'SuperAdmin');

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteConfig(config?._id));
      navigate(PATH_SETTING.configs.list);
      enqueueSnackbar('Config delete Successfully!');
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      enqueueSnackbar('Config delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.configs.edit(config._id));
  };

  const defaultValues = useMemo(
    () => ({
      name: config?.name,
      type: config?.type || '',
      value: config?.value || '',
      notes: config?.notes || '',
      isActive: config?.isActive,
      createdAt: config?.createdAt || '',
      createdByFullName: config?.createdBy?.name || '',
      createdIP: config?.createdIP || '',
      updatedAt: config?.updatedAt || '',
      updatedByFullName: config?.updatedBy?.name || '',
      updatedIP: config?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons isActive={defaultValues.isActive}
          handleEdit={handleEdit}
          disableEditButton={!isSuperAdmin}
          onDelete={onDelete}
          backLink={() => navigate(PATH_SETTING.configs.list)}
          settingPage
        />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues.name} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Type" param={defaultValues.type} />
          <ViewFormField isLoading={isLoading} sm={6} heading="Value" param={defaultValues.value} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Notes" param={defaultValues.notes} />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

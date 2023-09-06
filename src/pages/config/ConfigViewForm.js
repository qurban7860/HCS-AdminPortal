import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card,Grid,Tooltip } from '@mui/material';
// redux
import { deleteConfig } from '../../redux/slices/config/config';
// paths
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
// import { fDate, fDateTime } from '../../utils/formatTime';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ConfigViewForm() {
  const { config } = useSelector((state) => state.config);

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
      value: config?.value || '',
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
          <ViewFormField sm={12} heading="Value" param={defaultValues.value} />

          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

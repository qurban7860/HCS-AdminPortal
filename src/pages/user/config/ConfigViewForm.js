import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Tooltip } from '@mui/material';
// redux
import { deleteConfig} from '../../../redux/slices/securityUser/config';
// paths
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ConfigViewForm() {
  const { config } = useSelector((state) => state.userConfig);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteConfig(config?._id));
      navigate(PATH_SETTING.userConfig.list);
      enqueueSnackbar('Configuration deleted Successfully!');
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      enqueueSnackbar('Configuration delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.userConfig.edit(config._id));
  };

  const defaultValues = useMemo(
    () => ({
      blockedUsers:       config?.blockedUsers || [], 
      blockedCustomers:   config?.blockedCustomers || [], 
      whiteListIPs:       config?.whiteListIPs || [], 
      blackListIPs:       config?.blackListIPs || [],
      isActive:           config?.isActive,
      createdAt:          config?.createdAt || '',
      createdByFullName:  config?.createdBy?.name || '',
      createdIP:          config?.createdIP || '',
      updatedAt:          config?.updatedAt || '',
      updatedByFullName:  config?.updatedBy?.name || '',
      updatedIP:          config?.updatedIP || '',
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
          <Tooltip>
            <ViewFormField deleteDisabled={defaultValues.disableDelete} />
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={12} heading="Blocked Users" arrayParam={defaultValues?.blockedUsers} />
          <ViewFormField sm={12} heading="Blocked Customers" arrayParam={defaultValues?.blockedCustomers} />
          <ViewFormField sm={12} heading="White List Ips" chips={defaultValues?.whiteListIPs} />
          <ViewFormField sm={12} heading="Black List Ips" chips={defaultValues?.blackListIPs} />
          <ViewFormField  />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

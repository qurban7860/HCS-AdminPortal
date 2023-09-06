import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  deleteServiceRecordConfig,
} from '../../../redux/slices/products/serviceRecordConfig';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
// import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// ----------------------------------------------------------------------

ServiceRecordConfigViewForm.propTypes = {
  currentServiceRecordConfig: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ServiceRecordConfigViewForm({ currentServiceRecordConfig = null }) {
  const toggleEdit = () => {
    dispatch(setServiceRecordConfigEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.edit(id));
  };
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { serviceRecordConfig, editFormVisibility } = useSelector((state) => state.serviceRecordConfig);
  console.log("serviceRecordConfig : ", serviceRecordConfig)
  const { id } = useParams();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceRecordConfig(id));
    }
  }, [dispatch, id, editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
      name: serviceRecordConfig?.name || '',
      description: serviceRecordConfig?.description || '',
      isActive: serviceRecordConfig.isActive,
      connection: serviceRecordConfig.connections || false,
      createdByFullName: serviceRecordConfig?.createdBy?.name || '',
      createdAt: serviceRecordConfig?.createdAt || '',
      createdIP: serviceRecordConfig?.createdIP || '',
      updatedByFullName: serviceRecordConfig?.updatedBy?.name || '',
      updatedAt: serviceRecordConfig?.updatedAt || '',
      updatedIP: serviceRecordConfig?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentServiceRecordConfig, serviceRecordConfig]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteServiceRecordConfig(id));
      enqueueSnackbar('ServiceRecordConfig Deleted Successfullty!');
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('ServiceRecordConfig delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={12} heading="ServiceRecordConfig Name" param={defaultValues?.name} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormSwitch sm={12} isActiveHeading='Connect as a child' isActive={defaultValues.connection} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

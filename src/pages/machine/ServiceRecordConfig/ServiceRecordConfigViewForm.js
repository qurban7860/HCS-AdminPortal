import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Typography } from '@mui/material';
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
  // console.log("serviceRecordConfig : ", serviceRecordConfig)
  const { id } = useParams();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceRecordConfig(id));
    }
  }, [dispatch, id, editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
      recordType: serviceRecordConfig?.recordType || '',
      category: serviceRecordConfig?.category?.name || '',
      machineModel: serviceRecordConfig?.machineModel?.name || '',
      docTitle: serviceRecordConfig?.docTitle || '',
      textBeforeParams: serviceRecordConfig?.textBeforeParams || '',
      textAfterFields: serviceRecordConfig?.textAfterFields || '',
      checkParams: serviceRecordConfig?.checkParams || [],
      header: serviceRecordConfig?.header || {},
      footer: serviceRecordConfig?.footer || {},
      isActive: serviceRecordConfig?.isActive|| false,
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
        <ViewFormField sm={6} heading="Record Type" param={defaultValues?.recordType} />
        <ViewFormField sm={6} heading="Document Title" param={defaultValues?.docTitle} />
      </Grid>
      <Grid container>
        <ViewFormField sm={6} heading="Machine Category" param={defaultValues?.category} />
        <ViewFormField sm={6} heading="Machine Model" param={defaultValues?.machineModel} />
      </Grid>
      <Grid container>  
        <ViewFormField sm={6} heading="Text Befor Check Items" param={defaultValues?.textBeforeParams} />
      </Grid>
        <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
          Check Params
        </Typography>
        {(defaultValues?.checkParams.map((row, index) =>
          (
            <Grid container>
              <ViewFormField sm={6} heading="Param List Title" param={row?.paramListTitle} />
              <ViewFormField sm={6} heading="Param List" serviceParam={row?.paramList} />
            </Grid>
          ))
        )}
      <ViewFormField sm={6} heading="Text After Check Items" param={defaultValues?.textAfterFields} />

      
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Header
      </Typography>
      <Grid container>
        <ViewFormField sm={6} heading="Header Type" param={defaultValues?.header?.type} />
        <ViewFormField sm={6} heading="Header Left Text" param={defaultValues?.header?.leftText} />
        <ViewFormField sm={6} heading="Header Center Text" param={defaultValues?.header?.centerText} />
        <ViewFormField sm={6} heading="Header Right Text" param={defaultValues?.header?.rightText} />
      </Grid>
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Footer
      </Typography>
      <Grid container>
        <ViewFormField sm={6} heading="Footer Type" param={defaultValues?.footer?.type} />
        <ViewFormField sm={6} heading="Footer Left Text" param={defaultValues?.footer?.leftText} />
        <ViewFormField sm={6} heading="Footer Center Text" param={defaultValues?.footer?.centerText} />
        <ViewFormField sm={6} heading="Footer Right Text" param={defaultValues?.footer?.rightText} />
      </Grid>
        <ViewFormAudit defaultValues={defaultValues} />
    </Card>
  );
}

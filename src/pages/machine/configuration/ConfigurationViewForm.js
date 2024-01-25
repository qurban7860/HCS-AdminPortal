import {  useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  deleteConfiguration, getConfiguration,
} from '../../../redux/slices/products/configuration';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import CodeMirror from '../../../components/CodeMirror/JsonEditor';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function ConfigurationViewForm() {

  const { configuration, isLoading } = useSelector((state) => state.configuration);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const toggleEdit = () => { navigate(PATH_MACHINE.machines.settings.configuration.edit(id)) };


  useEffect(() => {
    if (id != null) {
      dispatch(getConfiguration(id));
    }
  }, [dispatch, id, ]);

  const defaultValues = useMemo(
    () => ({
      collectionType: configuration?.collectionType || '',
      configJSON: configuration?.configJSON || '',
      isActive: configuration?.isActive,
      createdByFullName: configuration?.createdBy?.name || '',
      createdAt: configuration?.createdAt || '',
      createdIP: configuration?.createdIP || '',
      updatedByFullName: configuration?.updatedBy?.name || '',
      updatedAt: configuration?.updatedAt || '',
      updatedIP: configuration?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ configuration ]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteConfiguration(id));
      enqueueSnackbar('Configuration Deleted Successfullty!');
      navigate(PATH_MACHINE.machines.settings.configuration.list);
    } catch (err) {
      enqueueSnackbar('Configuration delete Failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} handleEdit={toggleEdit} onDelete={onDelete} backLink={() => navigate(PATH_MACHINE.machines.settings.configuration.list)} />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Collection Type" param={defaultValues?.collectionType} />
        <CodeMirror value={JSON.stringify(defaultValues?.configJSON,null,2)} readOnly />                
        <ViewFormSwitch isLoading={isLoading} sm={12}  isActive={defaultValues.isActive} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

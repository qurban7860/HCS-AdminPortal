import { useMemo } from 'react';
// @mui
import { Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { deleteSetting } from '../../../redux/slices/products/machineSetting';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';

export default function SettingViewForm() {
  const { setting, isLoading } = useSelector((state) => state.machineSetting);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteSetting(machine._id, setting._id));
      enqueueSnackbar("Setting Archived Successfully!");
      navigate(PATH_MACHINE.machines.settings.root(machineId));
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteSetting, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = () => navigate(PATH_MACHINE.machines.settings.edit(machineId, id ));

  const defaultValues = useMemo(
    () => ({
      techParamValue: setting?.techParamValue || '',
      techParam: {
        code : setting?.techParam?.code || '',
        name : setting?.techParam?.name || '',
        description : setting?.techParam?.description || '',
        category : setting?.techParam?.category || {}
      },
      isActive: setting?.isActive,
      createdByFullName: setting?.createdBy?.name || '',
      createdAt: setting?.createdAt || '',
      createdIP: setting?.createdIP || '',
      updatedByFullName: setting?.updatedBy?.name || '',
      updatedAt: setting?.updatedAt || '',
      updatedIP: setting?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setting, machine]
  );
  return (
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} 
        backLink={()=> navigate(PATH_MACHINE.machines.settings.root(machineId))} 
        handleEdit={handleEdit} onDelete={onDelete}
        disableEditButton={machine?.status?.slug==='transferred'}
        disableDeleteButton={machine?.status?.slug==='transferred'}
        history={setting?.history  || [] }
        />
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues.techParam.category.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Parameter Name" param={defaultValues.techParam.name} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Parameter Value" param={defaultValues.techParamValue} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
  );
}

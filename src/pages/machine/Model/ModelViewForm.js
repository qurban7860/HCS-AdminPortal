import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// redux
import {
  setMachinemodelsEditFormVisibility,
  deleteMachineModel,
  getMachineModel 
} from '../../../redux/slices/products/model';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
// ----------------------------------------------------------------------

ModelViewForm.propTypes = {
  currentMachinemodel: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ModelViewForm({ currentMachinemodel = null }) {
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineModel, isLoading } = useSelector((state) => state.machinemodel);
  const { id } = useParams();
  
  const dispatch = useDispatch();
  const toggleEdit = () => {
    dispatch(setMachinemodelsEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.model.modeledit(id));
  };

  useEffect(()=>{
    dispatch(getMachineModel(id));
  },[dispatch, id])
  
  const defaultValues = useMemo(
    () => ({
      name: machineModel?.name || '',
      description: machineModel?.description || '',
      displayOrderNo: machineModel?.displayOrderNo || '',
      category: machineModel?.category || '',
      isActive: machineModel?.isActive,
      isDefault: machineModel?.isDefault,
      createdByFullName: machineModel?.createdBy?.name || '',
      createdAt: machineModel?.createdAt || '',
      createdIP: machineModel?.createdIP || '',
      updatedByFullName: machineModel?.updatedBy?.name || '',
      updatedAt: machineModel?.updatedAt || '',
      updatedIP: machineModel?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinemodel, machineModel]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteMachineModel(id));
      enqueueSnackbar('Model deleted Successfully!');
      navigate(PATH_MACHINE.machines.settings.model.list);
    } catch (err) {
      enqueueSnackbar('Model delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} 
          isDefault={defaultValues.isDefault}
          handleEdit={toggleEdit} 
          onDelete={onDelete} 
          backLink={() => navigate(PATH_MACHINE.machines.settings.model.list)}/>
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Model Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Category Name" param={defaultValues?.category?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

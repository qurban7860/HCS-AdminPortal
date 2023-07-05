import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button, Switch } from '@mui/material';
// redux
import {
  setMachinemodelsEditFormVisibility,
  deleteMachineModel,
} from '../../../redux/slices/products/model';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';
import ModelEditForm from './ModelEditForm';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSWitch from '../../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

ModelViewForm.propTypes = {
  currentMachinemodel: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ModelViewForm({ currentMachinemodel = null }) {
  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(setMachinemodelsEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.machineModel.modeledit(id));
  };

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { machineModel } = useSelector((state) => state.machinemodel);
  console.log('machinemodel : ', machineModel);
  const { id } = useParams();

  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: machineModel?.name || '',
      description: machineModel?.description || '',
      displayOrderNo: machineModel?.displayOrderNo || '',
      category: machineModel?.category || '',
      isActive: machineModel?.isActive,
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

  const onDelete = () => {
    try {
      dispatch(deleteMachineModel(id));
      navigate(PATH_MACHINE.machines.settings.machineModel.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }

      enqueueSnackbar('Model delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField sm={6} heading="Category Name" param={defaultValues?.category?.name} />
        <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField sm={6} heading="Description" param={defaultValues?.description} />
        <ViewFormSWitch isActive={defaultValues.isActive} />
        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

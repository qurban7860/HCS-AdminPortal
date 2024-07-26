import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useState, useLayoutEffect } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../confirm-dialog';
import { BUTTONS, DIALOGS } from '../../constants/default-constants';
import { useAuthContext } from '../../auth/useAuthContext';
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
import { setFormActiveStep } from '../../redux/slices/products/machineServiceRecord';

ServiceRecodStepButtons.propTypes = {
  handleSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool
};

export default function ServiceRecodStepButtons({
  handleSubmit,
  isSubmitting
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formActiveStep } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const handleNext = async () => {
    if(formActiveStep!==1){
      await handleSubmit();
    }
    await dispatch(setFormActiveStep(formActiveStep+1));
  } 

  const handleBack = async () => {
    await dispatch(setFormActiveStep(formActiveStep-1));
  } 

  const handleCancle = async () => {
    await navigate(PATH_MACHINE.machines.serviceRecords.root(machine?._id))
  } 
  
  return (
      <Stack justifyContent="flex-end" direction="row" spacing={2} px={2} pt={2}>
        <Grid item sm={6} display='flex' columnGap={2}>
            <Button size='large' onClick={handleCancle} variant="outlined">Cancel</Button>
        </Grid>
        <Grid item sm={6} display='flex' columnGap={2} justifyContent='flex-end'>
            <Button size='large' onClick={handleBack} disabled={ formActiveStep===0 } variant="outlined">Back</Button>
            <LoadingButton size='large' variant="contained" onClick={handleNext} loading={isSubmitting}>
              {formActiveStep===2?"Submit":"Next"}
            </LoadingButton>
        </Grid>
      </Stack>
  );
}

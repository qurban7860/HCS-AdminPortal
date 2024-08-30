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
import useResponsive from '../../hooks/useResponsive';

ServiceRecodStepButtons.propTypes = {
  handleDraft: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isDraft: PropTypes.bool,
  isActive: PropTypes.bool,
};

export default function ServiceRecodStepButtons({
  handleDraft,
  isSubmitting,
  isDraft,
  isActive
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formActiveStep } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);
  
  const isMobile = useResponsive('down', 'sm');

  const handleBack = async () => {
    await dispatch(setFormActiveStep(formActiveStep-1));
  } 

  const handleCancle = async () => {
    await navigate(PATH_MACHINE.machines.serviceRecords.root(machine?._id))
  } 
  
  return (
      <Stack justifyContent="flex-end" direction="row" spacing={2} px={2} pt={2}>
        <Grid item sm={6} display='flex' columnGap={2}>
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleCancle} variant="outlined">Exit</Button> 
        </Grid>
        <Grid item sm={6} display='flex' columnGap={2} justifyContent='flex-end'>
            {handleDraft && !isMobile && (<LoadingButton loading={isSubmitting && isDraft} size='large' onClick={handleDraft} type='submit' variant="outlined">Save & Exit</LoadingButton> )}
            <Button size={isMobile ? 'medium' : 'large'} onClick={handleBack} disabled={ formActiveStep===0 } variant="outlined">Back</Button>
            <LoadingButton disabled={!isActive && formActiveStep===2} size={isMobile ? 'medium' : 'large'} type='submit' variant="contained"  loading={isSubmitting && !isDraft}>
              {formActiveStep===2?"Submit":"Next"}
            </LoadingButton>
        </Grid>
      </Stack>
  );
}

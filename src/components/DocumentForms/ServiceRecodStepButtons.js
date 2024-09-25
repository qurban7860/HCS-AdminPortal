import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_MACHINE } from '../../routes/paths';
import { setFormActiveStep } from '../../redux/slices/products/machineServiceRecord';
import useResponsive from '../../hooks/useResponsive';

ServiceRecodStepButtons.propTypes = {
  handleDraft: PropTypes.func,
  isSubmitting: PropTypes.bool,
  finalSubmit: PropTypes.func,
  isDraft: PropTypes.bool,
  isActive: PropTypes.bool,
};

export default function ServiceRecodStepButtons({
  handleDraft,
  isSubmitting,
  finalSubmit,
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
  <Stack justifyContent="flex-end" direction={isMobile ? 'column' : 'row'} spacing={2} >
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3.5} display='flex' columnGap={2}>
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleCancle} variant="outlined">Exit</Button> 
        { handleDraft && (<LoadingButton loading={isSubmitting && isDraft} size={isMobile ? 'medium' : 'large'} onClick={handleDraft} type='submit' variant="outlined" fullWidth={isMobile}>Save as draft</LoadingButton> )}
        { finalSubmit && formActiveStep === 0 && <LoadingButton size={isMobile ? 'medium' : 'large'} onClick={finalSubmit} type='submit' variant="contained"  loading={isSubmitting && !isDraft}>Submit</LoadingButton>}
      </Grid>
      <Grid item xs={12} sm={8.5} display='flex' columnGap={2} justifyContent='flex-end' pr={2} >
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleBack} disabled={ formActiveStep===0 } variant="outlined">Back</Button>
          <LoadingButton disabled={!isActive && formActiveStep===2} size={isMobile ? 'medium' : 'large'} type='submit' variant="contained"  loading={isSubmitting && !isDraft}>
            {formActiveStep===2?"Submit":"Next"}
          </LoadingButton>
      </Grid>
    </Grid>
  </Stack>
  
  );
}

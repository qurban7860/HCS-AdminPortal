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
  handleSubmit: PropTypes.func,
  isDraft: PropTypes.bool,
  isActive: PropTypes.bool,
  finalReqest: PropTypes.bool,
};

export default function ServiceRecodStepButtons({
  handleDraft,
  isSubmitting,
  handleSubmit,
  isDraft,
  isActive,
  finalReqest
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
  <Stack justifyContent="flex-end" direction={isMobile ? 'column' : 'row'} >
    <Grid container sx={{ px: 2, pt:2 }} spacing={2} >
      <Grid item sm={12} md={6} display='flex' columnGap={2}>
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleCancle} variant="outlined">Exit</Button> 
        { handleDraft && (<LoadingButton loading={isSubmitting && isDraft} size={isMobile ? 'medium' : 'large'} onClick={handleDraft} type='submit' variant="outlined" fullWidth={isMobile}>Save as draft</LoadingButton> )}
        { handleSubmit && formActiveStep === 0 && <LoadingButton onClick={handleSubmit} size={isMobile ? 'medium' : 'large'} type='submit' variant="contained"  loading={isSubmitting && !isDraft && finalReqest }>Submit</LoadingButton>}
      </Grid>
      <Grid item sm={12} md={6} display='flex' columnGap={2} justifyContent='flex-end'  >
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleBack} disabled={ formActiveStep===0 } variant="outlined">Back</Button>
          <LoadingButton disabled={!isActive && formActiveStep===2} size={isMobile ? 'medium' : 'large'} type='submit' variant="contained"  loading={isSubmitting && !isDraft && !finalReqest }>
            {formActiveStep===2?"Submit":"Next"}
          </LoadingButton>
      </Grid>
    </Grid>
  </Stack>
  
  );
}

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { PATH_MACHINE } from '../../routes/paths';
import { setFormActiveStep } from '../../redux/slices/products/machineServiceReport';
import useResponsive from '../../hooks/useResponsive';

ServiceRecodStepButtons.propTypes = {
  handleDraft: PropTypes.func,
  isSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  isDraft: PropTypes.bool,
  isActive: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};

export default function ServiceRecodStepButtons({
  isDraft,
  isActive,
  isSubmitted,
  isSubmitting,
  handleDraft,
  handleSubmit,
}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formActiveStep } = useSelector((state) => state.machineServiceReport);
  const { machine } = useSelector((state) => state.machine);
  const { machineId, id } = useParams();
  const isMobile = useResponsive('down', 'sm');

  const handleBack = async () => {
    await dispatch(setFormActiveStep(formActiveStep-1));
  } 

  const handleCancle = async () => {
    if( machineId && id ){
    await navigate(PATH_MACHINE.machines.serviceReports.view( machineId, id ))
    } else {
      await navigate(PATH_MACHINE.machines.serviceReports.root(machine?._id))
    }
  } 

  return (
  <Stack justifyContent="flex-end" direction={isMobile ? 'column' : 'row'} >
    <Grid container sx={{ px: 2, pt:2 }} spacing={2} >
      <Grid item sm={12} md={6} display='flex' columnGap={2}>
        <Button size={isMobile ? 'medium' : 'large'} onClick={handleCancle} variant="outlined">Exit</Button> 
        { handleDraft && (
          <LoadingButton 
            loading={isSubmitting && isDraft && !isSubmitted } 
            size={isMobile ? 'medium' : 'large'} 
            onClick={handleDraft} 
            type='submit' 
            variant="outlined" 
            fullWidth={isMobile}
          >
            Save
          </LoadingButton> )}
      </Grid>
      <Grid item sm={12} md={6} display='flex' columnGap={2} justifyContent='flex-end' >
          {formActiveStep > 0 && 
            <Button 
              size={isMobile ? 'medium' : 'large'} 
              onClick={handleBack} 
              disabled={ formActiveStep===0 } 
              variant="outlined"
            >Back
            </Button>
          }
          <LoadingButton 
            loading={ isSubmitting && !isDraft && isSubmitted }
            onClick={ handleSubmit }
            disabled={!isActive && formActiveStep===2} 
            size={isMobile ? 'medium' : 'large'} 
            type='submit' 
            variant="contained"  
          >
            { ( formActiveStep === 2 || handleSubmit ) ? "Complete" : "Next" }
          </LoadingButton>
      </Grid>
    </Grid>
  </Stack>
  
  );
}

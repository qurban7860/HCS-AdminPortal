import { useLayoutEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Grid, StepLabel, Step, Stepper, Box, CardContent, CardHeader } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import {
  resetMachineServiceReport,
  deleteMachineServiceReport,
  getMachineServiceReport,
  setFormActiveStep,
} from '../../../redux/slices/products/machineServiceReport';
// components
import { useSnackbar } from '../../../components/snackbar';
import { handleError } from '../../../utils/errorHandler';
import MachineTabContainer from '../util/MachineTabContainer';
import ConfirmDialog from '../../../components/confirm-dialog';
import MachineServiceReportsFirstStep from './MachineServiceReportsFirstStep';
import MachineServiceReportsSecondStep from './MachineServiceReportsSecondStep';
import MachineServiceReportsThirdStep from './MachineServiceReportsThirdStep';
import { ColorlibConnector, ColorlibStepIcon } from '../../../theme/styles/default-styles';
import IconTooltip from '../../../components/Icons/IconTooltip';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

function MachineServiceReportAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const { formActiveStep, machineServiceReport, isLoading } = useSelector((state) => state.machineServiceReport);
  const [ completed, setCompleted ] = useState([]);
  const [ discardDialog, setDiscardDialog ] = useState( false );

  const isMobile = useResponsive('down', 'sm');

  useLayoutEffect(() => {
    if (machineId && id) {
      setCompleted((prev) => {
        const newCompleted = [...prev];
        newCompleted[0] = true;
        return newCompleted;
      });
      dispatch(getMachineServiceReport(machineId, id));
    }
    return () => {
      dispatch(resetMachineServiceReport());
    };
  }, [ dispatch, machineId, id ] );

  const handleStep = useCallback((step) => async () => {
    if (formActiveStep === 0 && !completed[formActiveStep]) {
      enqueueSnackbar(`Please complete step ${formActiveStep+1} to continue`, { variant: 'error' });
    } else {
      dispatch(setFormActiveStep(step));
    }
  }, [dispatch, enqueueSnackbar, formActiveStep, completed]);
  
  const handleBack = useCallback(() => {
    if (formActiveStep) {
      dispatch(setFormActiveStep(formActiveStep - 1));
    }
  }, [dispatch, formActiveStep]);
  
  const handleDraftRequest = useCallback(async (isDraft) => {
    if (isDraft) {
      await navigate(PATH_MACHINE.machines.serviceReports.root(machineId));
    }
  }, [navigate, machineId]);
  
  const handleDiscardDialog = async () => {

  }

  const handleDiscard = useCallback(async () => {
    try{
      if (machineServiceReport?._id) {
        await dispatch(deleteMachineServiceReport(machineId, machineServiceReport?._id, machineServiceReport?.status?._id));
      }
      setDiscardDialog(false)
      navigate(PATH_MACHINE.machines.serviceReports.root(machineId));
    } catch( error ){
      setDiscardDialog(false)
      enqueueSnackbar( handleError( error ) || 'Service Report discard failed!', { variant: 'error' });
    }
  }, [ dispatch, machineId, machineServiceReport, enqueueSnackbar, navigate ]);
  
  const handleComplete = useCallback((step) => {
    const newCompleted = [...completed];
    newCompleted[step] = true;
    setCompleted(newCompleted);
  }, [completed]);

  const steps = [
    <MachineServiceReportsFirstStep 
      handleComplete={handleComplete} 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
    />,
    <MachineServiceReportsSecondStep 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
      handleBack={handleBack}
    />,
    <MachineServiceReportsThirdStep 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
      handleBack={handleBack} 
    />
  ];

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='serviceReports' />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader 
                title={machineServiceReport?.serviceReportUID && `Service ID : ${machineServiceReport?.serviceReportUID || ''}  (${machineServiceReport?.status?.name || ''})`}
                action={
                  !isLoading &&
                    <Grid item display='flex' columnGap={1} mr={1}>
                      <IconTooltip title="Discard" onClick={()=> setDiscardDialog(true)} color="#FF0000" icon="mdi:archive" />
                    </Grid>
                }
              />
              <CardContent>
                {/* <Stepper nonLinear sx={{border:'1px solid lightgray', borderBottom:'none',  borderRadius:'10px 10px 0px 0px', py:1}} activeStep={formActiveStep} connector={<ColorlibConnector  />}>
                  <Step key='step_1'>
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(0)} icon='1/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Report Document'}</StepLabel>
                  </Step>
                  <Step key='step_2' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(1)} icon='2/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Check Items Value'}</StepLabel>
                  </Step>
                  <Step key='step_3' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(2)} icon='3/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Complete Service Report'}</StepLabel>
                  </Step>
                </Stepper> */}
                <Box sx={{
                    border:'1px solid lightgray', 
                    // borderRadius:'0px 0px 10px 10px', 
                    borderRadius:'10px', 
                    py:2,
                    marginTop:'0 !important'
                  }} 
                >
                  {steps[formActiveStep]}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      <ConfirmDialog
        open={ discardDialog }
        onClose={() => setDiscardDialog(false)}
        title="Discard"
        content="Are you sure you want to Discard?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={ isLoading}
            disabled={ isLoading }
            onClick={ handleDiscard }
          >
            Discard
          </LoadingButton>
        }
      />
    </Container>
  );
}

export default memo(MachineServiceReportAddForm)
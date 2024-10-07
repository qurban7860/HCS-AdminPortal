import { useLayoutEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Grid, StepLabel, Step, Stepper, Box, CardContent, CardHeader } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import {
  resetMachineServiceRecord,
  deleteMachineServiceRecord,
  getMachineServiceRecord,
  setFormActiveStep,
} from '../../../redux/slices/products/machineServiceRecord';
// components
import { useSnackbar } from '../../../components/snackbar';
import MachineTabContainer from '../util/MachineTabContainer';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import MachineServiceRecordsFirstStep from './MachineServiceRecordsFirstStep';
import MachineServiceRecordsSecondStep from './MachineServiceRecordsSecondStep';
import MachineServiceRecordsThirdStep from './MachineServiceRecordsThirdStep';
import { ColorlibConnector, ColorlibStepIcon } from '../../../theme/styles/default-styles';
import IconTooltip from '../../../components/Icons/IconTooltip';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const { formActiveStep, machineServiceRecord, isLoading } = useSelector((state) => state.machineServiceRecord);
  const [ completed, setCompleted ] = useState([]);
  const isMobile = useResponsive('down', 'sm');
  useLayoutEffect(() => {
    if (machineId && id) {
      setCompleted((prev) => {
        const newCompleted = [...prev];
        newCompleted[0] = true;
        return newCompleted;
      });
      dispatch(getMachineServiceRecord(machineId, id));
    }
    return () => {
      dispatch(resetMachineServiceRecord());
    };
  }, [dispatch, machineId, id]);

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
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId));
    }
  }, [navigate, machineId]);
  
  const handleDiscard = useCallback(async () => {
    if (machineServiceRecord?._id) {
      await dispatch(deleteMachineServiceRecord(machineId, machineServiceRecord?._id, machineServiceRecord?.status));
    }
    navigate(PATH_MACHINE.machines.serviceRecords.root(machineId));
  }, [dispatch, machineId, machineServiceRecord, navigate]);
  
  const handleComplete = useCallback((step) => {
    const newCompleted = [...completed];
    newCompleted[step] = true;
    setCompleted(newCompleted);
  }, [completed]);

  const steps = [
    <MachineServiceRecordsFirstStep 
      handleComplete={handleComplete} 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
    />,
    <MachineServiceRecordsSecondStep 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
      handleBack={handleBack}
    />,
    <MachineServiceRecordsThirdStep 
      handleDraftRequest={handleDraftRequest} 
      handleDiscard={handleDiscard} 
      handleBack={handleBack} 
    />
  ];

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='serviceRecords' />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader 
                title={machineServiceRecord?.serviceRecordUid && `Service ID : ${machineServiceRecord?.serviceRecordUid || ''}  (${machineServiceRecord?.status || ''})`}
                action={
                  !isLoading &&
                    <Grid item display='flex' columnGap={1} mr={1}>
                      <IconTooltip title="Discard" onClick={handleDiscard} color="#FF0000" icon="mdi:archive" />
                    </Grid>
                }
              />
              <CardContent>
                <Stepper nonLinear sx={{border:'1px solid lightgray', borderBottom:'none',  borderRadius:'10px 10px 0px 0px', py:1}} activeStep={formActiveStep} connector={<ColorlibConnector  />}>
                  <Step key='step_1'>
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(0)} icon='1/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Report Document'}</StepLabel>
                  </Step>
                  <Step key='step_2' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(1)} icon='2/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Check Items Value'}</StepLabel>
                  </Step>
                  <Step key='step_3' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(2)} icon='3/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Complete Service Record'}</StepLabel>
                  </Step>
                </Stepper>
                <Box sx={{border:'1px solid lightgray', borderRadius:'0px 0px 10px 10px', py:2,marginTop:'0 !important'}}>
                  {steps[formActiveStep]}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      <DialogServiceRecordAddFile />
    </Container>
  );
}

export default memo(MachineServiceRecordAddForm)
import { useEffect, useLayoutEffect, useMemo, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Container, Card, Grid, Stack, StepLabel, Step, Stepper, Box, StepContent, Button, StepButton, Typography, CardContent, CardHeader, Chip, createTheme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addMachineServiceRecord, updateMachineServiceRecord, resetMachineServiceRecord, 
        setAddFileDialog, deleteMachineServiceRecord, getMachineServiceRecord, setFormActiveStep,
        getMachineServiceRecordCheckItems} from '../../../redux/slices/products/machineServiceRecord';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordPart1Schema, MachineServiceRecordPart2Schema, MachineServiceRecordPart3Schema } from '../../schemas/machine';
import FormProvider from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import MachineServiceRecordsFirstStep from './MachineServiceRecordsFirstStep';
import MachineServiceRecordsSecondStep from './MachineServiceRecordsSecondStep';
import MachineServiceRecordsThirdStep from './MachineServiceRecordsThirdStep';
import Iconify from '../../../components/iconify';
import { ColorlibConnector, ColorlibStepIcon, StyledTooltip } from '../../../theme/styles/default-styles';
import IconTooltip from '../../../components/Icons/IconTooltip';

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { userId } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();

  const { machine } = useSelector((state) => state.machine)
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
  const { formActiveStep, machineServiceRecord } = useSelector((state) => state.machineServiceRecord);

  const [ securityUsers, setSecurityUsers ] = useState([]);
  const [ isPublish, setIsPublish ] = useState(false);
  const [completed, setCompleted] = useState([]);

  useLayoutEffect( ()=>{
    dispatch(resetMachineServiceRecord());
    dispatch(getActiveServiceRecordConfigsForRecords(machineId));
    dispatch(getActiveSecurityUsers({roleType:['TechnicalManager','Technician']}));
    
    if(machine?.customer?._id){
      dispatch(getActiveContacts(machine?.customer?._id));
    } 
    
    if(userId){
      dispatch(getSecurityUser( userId ))
    } 

    if(machineId && id){
      const newCompleted = completed;
      newCompleted[0] = true;
      setCompleted(newCompleted);
      dispatch((getMachineServiceRecord(machineId, id)));
    }
    
    
  },[dispatch, machineId, machine, userId, id, completed])
  
  useEffect(()=>{ 
    if(!activeSecurityUsers.some(u => u._id === userId )){
      setSecurityUsers([ ...activeSecurityUsers, securityUser ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }else {
      setSecurityUsers([ ...activeSecurityUsers ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSecurityUsers, securityUser, userId ]);

  const handleStep = (step) => async () => {
    if (formActiveStep===0 && !completed[formActiveStep]) {
      enqueueSnackbar(`Please complete step ${formActiveStep+1} to continue`, { variant: 'error' });
    }else{
      dispatch(setFormActiveStep(step));
    }
  };

  const handleBack = () => {
    if (formActiveStep) {
      dispatch(setFormActiveStep(formActiveStep-1));
    }
  };

  const handleDraftRequest = async (isDraft)=> {
    if(isDraft){
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    }
  }
  
  const handleDiscard = async () =>{
    if( machineServiceRecord?._id ){
      await dispatch(deleteMachineServiceRecord(machineId, machineServiceRecord?._id, machineServiceRecord?.status ))
    }
    navigate(PATH_MACHINE.machines.serviceRecords.root(machineId));
  } 

  const handleComplete = (step) => {
    const newCompleted = completed;
    newCompleted[step] = true;
    setCompleted(newCompleted);
  }

  const theme = useTheme();


  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='serviceRecords' />
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card>
              <CardHeader 
                title={machineServiceRecord?.serviceRecordUid && `Service ID : ${machineServiceRecord?.serviceRecordUid || ''}  (${machineServiceRecord?.status || ''})`}
                action={
                  <Grid item display='flex' direction='row' columnGap={1} mr={1}>
                    <IconTooltip title="Discard" onClick={handleDiscard} color="#FF0000" icon="mdi:archive" />
                    {/* <LoadingButton size='large' onClick={handleDiscard} color='error' startIcon={<Iconify icon="mdi:archive" />} variant='outlined'>Discard</LoadingButton> */}
                  </Grid>
                }
              />
              <CardContent>
                <Stepper nonLinear sx={{border:'1px solid lightgray', borderBottom:'none',  borderRadius:'10px 10px 0px 0px', py:1}} activeStep={formActiveStep} connector={<ColorlibConnector  />}>
                  <Step key='step_1'>
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(0)} icon='1/3'  StepIconComponent={ColorlibStepIcon}>Create Service Record</StepLabel>
                  </Step>
                  <Step key='step_2' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(1)} icon='2/3'  StepIconComponent={ColorlibStepIcon}>Check Items Value</StepLabel>
                  </Step>
                  <Step key='step_3' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(2)} icon='3/3'  StepIconComponent={ColorlibStepIcon}>Complete Service Record</StepLabel>
                  </Step>
                </Stepper>
                <Box sx={{border:'1px solid lightgray', borderRadius:'0px 0px 10px 10px', py:2,marginTop:'0 !important'}}>
                    {formActiveStep===0 &&
                      <MachineServiceRecordsFirstStep 
                        securityUsers={securityUsers} 
                        handleComplete={handleComplete}
                        handleDraftRequest={handleDraftRequest}
                        handleDiscard={handleDiscard}
                        handleBack={handleBack}
                      />
                    }
                    {formActiveStep===1 &&
                      <MachineServiceRecordsSecondStep 
                        handleDraftRequest={handleDraftRequest}
                        handleDiscard={handleDiscard}
                        handleBack={handleBack} 
                        serviceRecord={machineServiceRecord} 
                       />
                    }

                    {formActiveStep===2 &&
                      <MachineServiceRecordsThirdStep 
                        handleDraftRequest={handleDraftRequest}
                        handleDiscard={handleDiscard}
                        handleBack={handleBack}
                      />
                    }
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
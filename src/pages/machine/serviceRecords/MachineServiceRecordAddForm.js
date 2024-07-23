import { useEffect, useLayoutEffect, useMemo, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Card, Grid, Stack, StepLabel, Step, Stepper, Box, StepContent, Button, StepButton, Typography } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addMachineServiceRecord, updateMachineServiceRecord, resetMachineServiceRecord, 
        deleteFile, downloadFile, setAddFileDialog, deleteMachineServiceRecord, getMachineServiceRecord, 
        setFormActiveStep} from '../../../redux/slices/products/machineServiceRecord';
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
import { ColorlibConnector, ColorlibStepIcon } from '../../../theme/styles/default-styles';

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
  const [ isDraft, setIsDraft ] = useState(false);
  const [completed, setCompleted] = useState([]);

  useLayoutEffect( ()=>{
    dispatch(getActiveServiceRecordConfigsForRecords(machine?._id))
    dispatch(getActiveSecurityUsers({roleType:['TechnicalManager','Technician']}))
    
    if(machine?.customer?._id){
      dispatch(getActiveContacts(machine?.customer?._id))
    } 
    
    if(userId){
      dispatch(getSecurityUser( userId ))
    } 

    if(machine?._id && id){
      const newCompleted = completed;
      newCompleted[0] = true;
      setCompleted(newCompleted);
      dispatch((getMachineServiceRecord(machine?._id, id)))
    }
    
    
  },[dispatch, machine, userId, id, completed])
  
  const machineDecoilers = (machine?.machineConnections || []).map((decoiler) => ({
    _id: decoiler?.connectedMachine?._id ?? null,
    name: decoiler?.connectedMachine?.name ?? null,
    serialNo: decoiler?.connectedMachine?.serialNo ?? null
  }));

  useEffect(()=>{ 
    if(!activeSecurityUsers.some(u => u._id === userId )){
      setSecurityUsers([ ...activeSecurityUsers, securityUser ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }else {
      setSecurityUsers([ ...activeSecurityUsers ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSecurityUsers, securityUser, userId ]);

  // const [selectedConfig, setSelectedConfig] = useState();
  // const handleChangeConfig = async (newValue) => {
  //   if(newValue){
  //     setSelectedConfig(newValue);
  //   }
  // }


  const handleStep = (step) => async () => {
    if (formActiveStep===0 && !completed[formActiveStep]) {
      enqueueSnackbar(`Please complete step ${formActiveStep+1} to continue`, { variant: 'error' });
    }else{
      dispatch(setFormActiveStep(step));
    }
  };

  const handleComplete = (step) => {
    const newCompleted = completed;
    newCompleted[step] = true;
    setCompleted(newCompleted);
  }

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='serviceRecords' />
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stepper nonLinear activeStep={formActiveStep} connector={<ColorlibConnector  />}>
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
                    {formActiveStep===0 &&
                      <MachineServiceRecordsFirstStep 
                        securityUsers={securityUsers} 
                        // onChangeConfig={handleChangeConfig}
                        handleComplete={handleComplete}
                      />
                    }
                    {formActiveStep===1 &&
                      <MachineServiceRecordsSecondStep serviceRecord={machineServiceRecord}  />
                    }

                    {formActiveStep===2 &&
                      <MachineServiceRecordsThirdStep 
                      />
                    }
              </Stack>
            </Card>
          </Grid>
        </Grid>
      <DialogServiceRecordAddFile />
    </Container>
  );
}

export default memo(MachineServiceRecordAddForm)
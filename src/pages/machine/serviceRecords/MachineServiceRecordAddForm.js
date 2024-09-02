import { useEffect, useState, memo } from 'react';
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
import { getActiveContacts, getActiveSPContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import { getActiveServiceRecordConfigsForRecords } from '../../../redux/slices/products/serviceRecordConfig';
import { useAuthContext } from '../../../auth/useAuthContext';
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
  const { user, userId } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { machine } = useSelector((state) => state.machine)
  const { formActiveStep, machineServiceRecord, isLoading } = useSelector((state) => state.machineServiceRecord);
  const [ technicians, setTechnicians ] = useState([]);
  const [ userTechnician, setUserTechnician ] = useState( null );
  const [ completed, setCompleted ] = useState([]);
  
  const isMobile = useResponsive('down', 'sm');

  useEffect(() => {
    dispatch(resetMachineServiceRecord());
    dispatch(getActiveServiceRecordConfigsForRecords(machineId));
    dispatch(getActiveSPContacts());
    if (machine?.customer?._id) {
      dispatch(getActiveContacts(machine?.customer?._id));
    }

    if (userId) {
      dispatch(getSecurityUser(userId));
    }

    if (machineId && id) {
      const newCompleted = completed;
      newCompleted[0] = true;
      setCompleted(newCompleted);
      dispatch(getMachineServiceRecord(machineId, id));
    }
  }, [dispatch, machineId, machine, userId, id, completed]);

  useEffect(() => {
    if (activeSpContacts?.length > 0) {
      const sPContactUser = activeSpContacts?.find( ( el )=> el?._id === user?.contact );
      if( !machineServiceRecord?._id ){
        setUserTechnician( sPContactUser )
      }
      let techniciansList = activeSpContacts?.filter( ( el ) => el?.departmentDetails?.departmentType?.toLowerCase() === 'technical');
      if ( machineServiceRecord?.technician && !techniciansList?.some( ( el ) => ( el?._id === machineServiceRecord?.technician?._id ) ) ) {
        techniciansList = [ machineServiceRecord?.technician, ...techniciansList ];
      }
      if ( !techniciansList?.some( ( el ) => el?._id === user?.contact ) ) {
        techniciansList = [ sPContactUser, ...techniciansList ]
      }
      techniciansList = techniciansList?.sort((a, b) => a?.firstName.localeCompare(b?.firstName) );
      setTechnicians(techniciansList);
    }
  }, [ activeSpContacts, machineServiceRecord, user?.contact ]);

  const handleStep = (step) => async () => {
    if (formActiveStep === 0 && !completed[formActiveStep]) {
      enqueueSnackbar(`Please complete step ${formActiveStep+1} to continue`, { variant: 'error' });
    } else {
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
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(0)} icon='1/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Create Service Record'}</StepLabel>
                  </Step>
                  <Step key='step_2' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(1)} icon='2/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Check Items Value'}</StepLabel>
                  </Step>
                  <Step key='step_3' >
                    <StepLabel sx={{cursor:'pointer'}} onClick={handleStep(2)} icon='3/3'  StepIconComponent={ColorlibStepIcon}>{!isMobile && 'Complete Service Record'}</StepLabel>
                  </Step>
                </Stepper>
                <Box sx={{border:'1px solid lightgray', borderRadius:'0px 0px 10px 10px', py:2,marginTop:'0 !important'}}>
                    {formActiveStep===0 &&
                      <MachineServiceRecordsFirstStep 
                        userTechnician={ userTechnician }
                        technicians={ technicians } 
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
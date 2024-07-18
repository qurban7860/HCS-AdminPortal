import { useEffect, useLayoutEffect, useMemo, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Card, Grid, Stack, StepLabel, Step, Stepper, Box, StepContent, Button } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addMachineServiceRecord, updateMachineServiceRecord, resetMachineServiceRecord, deleteFile, downloadFile, setAddFileDialog, deleteMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordPart1Schema, MachineServiceRecordPart2Schema, MachineServiceRecordPart3Schema } from '../../schemas/machine';
import FormProvider from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import DialogServiceRecordAddFile from '../../../components/Dialog/DialogServiceRecordAddFile';
import MachineServiceRecordsFirstStep from './MachineServiceRecordsFirstStep';
import MachineServiceRecordsSecondStep from './MachineServiceRecordsSecondStep';
import MachineServiceRecordsThirdStep from './MachineServiceRecordsThirdStep';


// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { userId } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId } = useParams();

  const { machine } = useSelector((state) => state.machine)
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
  const { activeServiceRecordConfigsForRecords, serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);

  const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);
  const [ checkItemLists, setCheckItemLists ] = useState([]);
  const [ securityUsers, setSecurityUsers ] = useState([]);
  const [ activeStep, setActiveStep ] = useState(0);
  const [ isPublish, setIsPublish ] = useState(false);
  const [ isDraft, setIsDraft ] = useState(false);




  useLayoutEffect( ()=>{
    dispatch(resetMachineServiceRecord())
    dispatch(getActiveServiceRecordConfigsForRecords(machine?._id))
    // dispatch(resetActiveContacts())
    if(machine?.customer?._id) dispatch(getActiveContacts(machine?.customer?._id))
    dispatch(getActiveSecurityUsers({roleType:['TechnicalManager','Technician']}))
    if(userId) dispatch(getSecurityUser( userId ))
    dispatch(resetServiceRecordConfig())
    
  },[dispatch, machine, userId ])


  const machineDecoilers = (machine?.machineConnections || []).map((decoiler) => ({
    _id: decoiler?.connectedMachine?._id ?? null,
    name: decoiler?.connectedMachine?.name ?? null,
    serialNo: decoiler?.connectedMachine?.serialNo ?? null
  }));

  console.log('machineServiceRecord : ',machineServiceRecord)

  const defaultValues = useMemo(
    () => {
      const initialValues = {
      // serviceId:                    machineServiceRecord?.serviceId || null,
      docRecordType:                machineServiceRecord?.docRecordType || null,
      serviceRecordConfiguration:   machineServiceRecord?.serviceRecordConfiguration || null,
      serviceDate:                  machineServiceRecord?.serviceDate || new Date(),
      versionNo:                    machineServiceRecord?.versionNo || 1,
      customer:                     machine?.customer?._id || null,
      site:                         machine?.instalationSite?._id,
      // machine:                      machine?._id || null,
      decoilers:                    machineServiceRecord?.decoilers || machineDecoilers || [],
      technician:                   machineServiceRecord?.technician || ( securityUser || null ),
      technicianNotes:              machineServiceRecord?.technicianNotes || '',
      textBeforeCheckItems:         machineServiceRecord?.textBeforeCheckItems || '',
      textAfterCheckItems:          machineServiceRecord?.textAfterCheckItems || '',
      serviceNote:                  machineServiceRecord?.serviceNote || '',
      recommendationNote:           machineServiceRecord?.recommendationNote || '',
      internalComments:             machineServiceRecord?.internalComments || '',
      suggestedSpares:              machineServiceRecord?.suggestedSpares || '',
      internalNote:                 machineServiceRecord?.internalNote || '',
      operators:                    machineServiceRecord?.operators || [],
      files:                        machineServiceRecord?.files || [],
      operatorNotes:                machineServiceRecord?.operatorNotes || '',
      checkItemRecordValues:        machineServiceRecord?.checkItemRecordValues || [],
      isActive:                     machineServiceRecord?.isActive || true,
    }
    return initialValues;
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machine, machineDecoilers ]
  );
  const stepSchemas = [ MachineServiceRecordPart1Schema, MachineServiceRecordPart2Schema, MachineServiceRecordPart3Schema ];
  
  const methods = useForm({
    resolver: yupResolver(stepSchemas[activeStep]),
    defaultValues,
  });


  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { serviceId, files, decoilers, operators, serviceRecordConfiguration, docRecordType } = watch()

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file, index) => 
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ files ]
  );
  
  useEffect(()=>{
    reset();
  },[ reset ])

  useEffect(()=>{ 
    if(!activeSecurityUsers.some(u => u._id === userId )){
      setSecurityUsers([ ...activeSecurityUsers, securityUser ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
      setValue( 'technician' , securityUser )
    }else {
      setSecurityUsers([ ...activeSecurityUsers ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
      setValue( 'technician' , securityUser )
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSecurityUsers, securityUser, userId ])

    useEffect(() => {
      if(docRecordType?.name){
        if(docRecordType?.name !== serviceRecordConfiguration?.recordType ){
          dispatch(resetServiceRecordConfig())
        }
        setActiveServiceRecordConfigs(activeServiceRecordConfigsForRecords.filter(activeRecordConfig => activeRecordConfig?.recordType?.toLowerCase() === docRecordType?.name?.toLowerCase() ))
      }else{
        setActiveServiceRecordConfigs([])
      }
      setValue('serviceRecordConfiguration',null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[docRecordType, activeServiceRecordConfigsForRecords])
    

    useEffect(() =>{
      if(serviceRecordConfiguration !== null){
      dispatch(getServiceRecordConfig(serviceRecordConfiguration?._id))
    }
    },[dispatch, serviceRecordConfiguration])


  useEffect(()=>{
    setCheckItemLists(serviceRecordConfig?.checkItemLists)
  },[serviceRecordConfig])

  const handleParamChange = (event, newValue) => {
    if(newValue){
      if(newValue?.textBeforeCheckItems)
        setValue('textBeforeCheckItems',newValue.textBeforeCheckItems)

      if(newValue?.textAfterCheckItems)
        setValue('textAfterCheckItems',newValue.textAfterCheckItems)

      setValue('serviceRecordConfiguration',newValue)
      trigger('serviceRecordConfiguration');
    }else{
      dispatch(resetServiceRecordConfig())
      setValue('serviceRecordConfiguration',null)
    }
  }
  
  const handleDraftRequest = async ()=> {
    if(isDraft){
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    }
  }
  const onSubmit = async (data) => {
    try {
      if(activeStep === 0 && !machineServiceRecord?._id ){
        const result = await dispatch(addMachineServiceRecord( machine?._id, data ));
        await handleDraftRequest()
      }

      if(isDraft){
        await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
      }


      if(isPublish){
        data.status ="SUBMITTED"
      } else {
        data.status ="DRAFT"
      }

      if( activeStep === 1 ){
        const checkItemLists_ = [];
        if(checkItemLists && Array.isArray(checkItemLists) && checkItemLists.length > 0 ){ 
          checkItemLists.forEach((checkParam_, index )=>{
            if(Array.isArray(checkParam_.checkItems) && 
            checkParam_.checkItems.length>0) {
              checkParam_.checkItems.forEach((CI,ind)=>(
                CI?.checked && checkItemLists_.push({
                  machineCheckItem: CI?._id,
                  checkItemListId:  checkParam_?._id,
                  checkItemValue:   CI?.inputType?.toLowerCase() === 'boolean' ? CI?.checkItemValue || false : CI?.inputType?.toLowerCase() === 'status' && CI?.checkItemValue?.name || CI?.inputType?.toLowerCase() !== 'status' &&CI?.checkItemValue || '',
                  comments:CI?.comments,
                })
              ));
            }
          });
        }
        data.checkItemRecordValues = checkItemLists_;
      }

      if(activeStep < 3){
        setActiveStep(( previousStep ) => previousStep +1 )
      }

      if(activeStep > 0 ){
        data.update = true;
        data.decoilers = decoilers;
        data.operators = operators;
        try{
          if(machineServiceRecord?._id){
            await dispatch(updateMachineServiceRecord( machine?._id, machineServiceRecord?._id, data ));
            await reset();
            await handleDraftRequest()
          }
        } catch(e){
          console.error(e);
        }
        if(activeStep === 2 ){
          await reset();
          await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
        }
      }


    } catch (err) {
      console.error(err);
      enqueueSnackbar('Saving failed!', { variant: `error` });
    }
  };
  
  const toggleCancel = async () =>{
    if( machineServiceRecord?._id ){
      await dispatch(deleteMachineServiceRecord(machineId, machineServiceRecord?._id, machineServiceRecord?.status ))
    }
    navigate(PATH_MACHINE.machines.serviceRecords.root(machineId));
  } 

  const saveAsDraft = async () => setIsDraft(false); 

  const handleChangeCheckItemListValue = (index, childIndex, checkItemValue) => {
      const updatedCheckParams = [ ...checkItemLists ];
      const updatedParamObject = { ...updatedCheckParams[index], checkItems: [...updatedCheckParams[index].checkItems] };
      updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], checkItemValue };
      updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListDate = (index, childIndex, date) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { ...updatedCheckParams[index], checkItems: [...updatedCheckParams[index].checkItems] };
    updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], checkItemValue: date };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }
  
  const handleChangeCheckItemListCheckBoxValue = (index, childIndex) => {
      const updatedCheckParams = [...checkItemLists];
        const updatedParamObject = { ...updatedCheckParams[index], checkItems: [ ...updatedCheckParams[index].checkItems] };
        updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], checkItemValue: !updatedParamObject.checkItems[childIndex].checkItemValue };
        updatedCheckParams[index] = updatedParamObject;
      setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListChecked = ( index, childIndex ) =>{
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { ...updatedCheckParams[index], checkItems: [ ...updatedCheckParams[index].checkItems] };
    updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], checked: !updatedParamObject.checkItems[childIndex].checked };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListStatus = (index, childIndex, status) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { ...updatedCheckParams[index], checkItems: [ ...updatedCheckParams[index].checkItems ] };
    updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], checkItemValue: status };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListComment = (index, childIndex, comments) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { ...updatedCheckParams[index], checkItems: [...updatedCheckParams[index].checkItems ] };
    updatedParamObject.checkItems[childIndex] = { ...updatedParamObject.checkItems[childIndex], comments };
    updatedCheckParams[index] = updatedParamObject;
    setCheckItemLists(updatedCheckParams);
  }


  const regEx = /^[^2]*/;
  const [slides, setSlides] = useState([]);

  const handleAddFileDialog = ()=> dispatch(setAddFileDialog(true));

  const handleOpenLightbox = async (_index) => {
    const image = slides[_index];
    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(downloadFile(machineId, serviceId, image?._id));
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const updatedSlides = [
            ...slides.slice(0, _index), // copies slides before the updated slide
            {
              ...slides[_index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slides.slice(_index + 1), // copies slides after the updated slide
          ];
          // Update the state with the new array
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await dispatch(deleteFile(machineId, serviceId, fileId));
      enqueueSnackbar('File Archived successfully!');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = (fileId, name, extension) => {
    dispatch(downloadFile(machineId, serviceId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${name}.${extension}`, { type: extension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
        if ( err.Message) {
          enqueueSnackbar(err.Message, { variant: `error` });
        } else if (err.message) {
          enqueueSnackbar(err.message, { variant: `error` });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: `error` });
        }
      });
  };

const handleSave = () => {
    if (activeStep === 2) {
      setIsPublish(true);
    }
}

  return (
    <Container maxWidth={false} >
        <MachineTabContainer currentTabValue='serviceRecords' />
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormLabel content="New Service Record" />
                <Box sx={{ width: "100%" }} >
                  <Stepper activeStep={activeStep} >
                      <Step key={11111} on>
                        <StepLabel >
                          Create Service Record
                        </StepLabel>
                        <StepContent>
                          <Stack spacing={2}>
                            <MachineServiceRecordsFirstStep 
                              activeServiceRecordConfigs={activeServiceRecordConfigs} 
                              securityUsers={securityUsers} 
                              onChange={handleParamChange}  
                            />
                          </Stack>
                        </StepContent>
                      </Step>
                      <Step key={22222} >
                        <StepLabel >
                        Check Items Value
                        </StepLabel>
                        <StepContent>
                          <Stack spacing={2}>
                            <MachineServiceRecordsSecondStep 
                              checkItemLists={checkItemLists}
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                            />
                          </Stack>
                        </StepContent>
                      </Step>
                      <Step key={33333} >
                        <StepLabel >
                        Complete Service Record
                        </StepLabel>
                        <StepContent>
                          <Stack spacing={2}>
                            <MachineServiceRecordsThirdStep 
                              serviceRecordConfig={serviceRecordConfig}
                              docRecordType={docRecordType}
                              files={files}
                              handleOpenLightbox={handleOpenLightbox}
                              handleDownloadFile={handleDownloadFile}
                              handleDeleteFile={handleDeleteFile}
                              handleAddFileDialog={handleAddFileDialog}
                            />
                          </Stack>
                        </StepContent>
                      </Step>
                  </Stepper>
                  </Box>
                  <AddFormButtons isSubmitting={isSubmitting} 
                    saveAsDraft={saveAsDraft} isDraft={isDraft}
                    saveButtonName={ activeStep > 1 ? "Publish" : "Next"} handleSave={ handleSave } isDisableSaveAsDraft={activeStep === 0}
                    isDisabledBackButton={activeStep === 0} backButtonName="Back" handleBack={()=> setActiveStep( preStep => preStep - 1)} 
                    toggleCancel={toggleCancel} cancelButtonName="Discard" 
                  />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <DialogServiceRecordAddFile />
    </Container>
  );
}

export default memo(MachineServiceRecordAddForm)
import { useEffect, useMemo, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Box, Card, Grid, Stack, Skeleton } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import { addMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../../constants/default-constants';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFDatePicker,
  RHFUpload
} from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { userId } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId } = useParams();

  const { machine } = useSelector((state) => state.machine)
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigsForRecords, serviceRecordConfig, recordTypes, isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);

  const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);
  const [ checkItemLists, setCheckItemLists ] = useState([]);
  const [ securityUsers, setSecurityUsers ] = useState([]);


  useEffect( ()=>{
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


  const defaultValues = useMemo(
    () => {
      const initialValues = {
      docRecordType:                null,
      serviceRecordConfiguration:   null,
      serviceDate:                  new Date(),
      versionNo:                    1,
      customer:                     machine?.customer?._id || null,
      site:                         machine?.instalationSite?._id,
      // machine:                      machine?._id || null,
      decoilers:                    machineDecoilers || [],
      technician:                   securityUser || null,
      technicianNotes:              '',
      textBeforeCheckItems:         '',
      textAfterCheckItems:          '',
      serviceNote:                  '',
      recommendationNote:           '',
      internalComments:             '',
      suggestedSpares:              '',
      internalNote:                 '',
      operators:                    [],
      files:                        [],
      operatorNotes:                '',
      checkItemRecordValues:        [],
      isActive:                     true,
    }
    return initialValues;
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machine, machineDecoilers ]
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
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

  const { files, decoilers, operators, serviceRecordConfiguration, docRecordType } = watch()

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
    if(newValue != null){
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
  

  const onSubmit = async (data) => {
    try {
      const checkItemLists_ = [];
      if(checkItemLists && 
        Array.isArray(checkItemLists) && 
        checkItemLists.length>0) 
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
      data.checkItemRecordValues = checkItemLists_;
      data.decoilers = decoilers;
      data.operators = operators;
      await dispatch(addMachineServiceRecord(machine?._id,data));
      await reset();
      await navigate(PATH_MACHINE.machines.serviceRecords.root(machineId))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  
  const toggleCancel = () => navigate(PATH_MACHINE.machines.serviceRecords.root(machineId));

  const handleChangeCheckItemListValue = (index, childIndex, checkItemValue) => {
      const updatedCheckParams = [...checkItemLists];
      const updatedParamObject = { 
        ...updatedCheckParams[index],
        checkItems: [...updatedCheckParams[index].checkItems],
      };
      updatedParamObject.checkItems[childIndex] = {
        ...updatedParamObject.checkItems[childIndex],
        checkItemValue,
      };
      updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListDate = (index, childIndex, date) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [...updatedCheckParams[index].checkItems],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checkItemValue: date,
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }
  
  const handleChangeCheckItemListCheckBoxValue = (index, childIndex) => {
      const updatedCheckParams = [...checkItemLists];
        const updatedParamObject = { 
          ...updatedCheckParams[index],
          checkItems: [ ...updatedCheckParams[index].checkItems],
        };
        updatedParamObject.checkItems[childIndex] = {
          ...updatedParamObject.checkItems[childIndex],
          checkItemValue: !updatedParamObject.checkItems[childIndex].checkItemValue,
        };
        updatedCheckParams[index] = updatedParamObject;
      setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListChecked = ( index, childIndex ) =>{
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [ ...updatedCheckParams[index].checkItems],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checked: !updatedParamObject.checkItems[childIndex].checked,
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListStatus = (index, childIndex, status) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [ ...updatedCheckParams[index].checkItems ],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checkItemValue: status 
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListComment = (index, childIndex, comments) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [...updatedCheckParams[index].checkItems ],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      comments
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
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

                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  <RHFAutocomplete 
                    name="docRecordType"
                    label="Document Type*"
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete
                    name="serviceRecordConfiguration"
                    label="Service Record Configuration*"
                    options={activeServiceRecordConfigs}
                    getOptionLabel={(option) => `${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}</li>
                    )}
                    onChange={handleParamChange}
                  />
                </Box>       
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="serviceDate" label="Service Date" />
                  <RHFTextField name="versionNo" label="Version No" disabled/>
                  
                  </Box>
                    <RHFAutocomplete
                      name="technician"
                      label="Technician"
                      options={ securityUsers }
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{option.name || ''}</li>)}
                    />
                    <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/> 
                    <RHFUpload multiple  thumbnail name="files" imagesOnly
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files.length > 1 ?
                        setValue(
                          'files',
                          files &&
                            files?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        ): setValue('files', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    />
                    
                    <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline/> 
                    
                    {checkItemLists?.length > 0 && <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

                    {isLoadingCheckItems ? 
                    <Box sx={{ width: '100%',mt:1 }}>
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation={false} />
                    </Box>
                    :<>
                    {checkItemLists?.map((row, index) =>
                          ( typeof row?.checkItems?.length === 'number' &&
                            <CollapsibleCheckedItemInputRow 
                              key={index}
                              row={row} 
                              index={index} 
                              checkItemLists={checkItemLists} 
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                            />
                          ))}
                      </>
                    }

                    <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline/> 
                    { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label={`${docRecordType?.name?.charAt(0).toUpperCase()||''}${docRecordType?.name?.slice(1).toLowerCase()||''} Note`} minRows={3} multiline/> }
                    { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                    <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 

                      <RHFAutocomplete 
                        multiple
                        disableCloseOnSelect
                        filterSelectedOptions
                        name="operators" 
                        label="Operators"
                        options={activeContacts}
                        getOptionLabel={(option) => `${option?.firstName ||  ''} ${option.lastName || ''}`}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      />

                    <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 

                  <Grid container display="flex">
                    <RHFSwitch name="isActive" label="Active"/>
                  </Grid>
                  <AddFormButtons isDisabled={docRecordType === null} isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default memo(MachineServiceRecordAddForm)
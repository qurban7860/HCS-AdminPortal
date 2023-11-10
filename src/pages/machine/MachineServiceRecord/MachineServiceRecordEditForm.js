import {  useEffect, useCallback, useMemo, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, TableContainer, Table, TableBody, TextField, Autocomplete, Checkbox, InputAdornment, Skeleton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { v4 as uuidv4 } from 'uuid';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// slice
import { updateMachineServiceRecord, setMachineServiceRecordViewFormVisibility, getMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getMachineConnections } from '../../../redux/slices/products/machineConnections';
import { getActiveServiceRecordConfigsForRecords } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
  RHFDatePicker,
  RHFCheckbox,
} from '../../../components/hook-form';
import CollapsibleCheckedItemRow from '../ServiceRecordConfig/CollapsibleCheckedItemRow'
import { getActiveSecurityUsers } from '../../../redux/slices/securityUser/securityUser';
import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow';

// ----------------------------------------------------------------------

function MachineServiceRecordEditForm() {

  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigs, recordTypes, isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);
  const { machine } = useSelector((state) => state.machine);
  const [checkParam, setCheckParam] = useState([]);
  const [serviceDateError, setServiceDateError] = useState('');
  const [checkItemLists, setCheckItemLists] = useState([]);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { activeSecurityUsers } = useSelector((state) => state.user);

  useEffect( ()=>{
    // dispatch(getActiveServiceRecordConfigsForRecords(machine?._id))
    dispatch(resetActiveContacts())
    if(machine?.customer?._id){
      dispatch(getActiveContacts(machine?.customer?._id))
    }
    dispatch(getActiveSecurityUsers({roleType:'Support'}))
  },[dispatch, machine])

  useEffect(() => {

    if (machineServiceRecord) {
      const checkItems = machineServiceRecord?.serviceRecordConfig?.checkItemLists;
      if (checkItems) {
        const params_ = checkItems.map((row, index) => {
          if (row && row?.checkItems) {
            const updatedCheckItemsList = row?.checkItems?.map((childRow, childIndex) => 

              ({
                _id:            childRow?._id || '',
                inputType:      childRow?.inputType || '',
                isRequired:     childRow?.isRequired || '',
                maxValidation:  childRow?.maxValidation || '',
                minValidation:  childRow?.minValidation || '',
                name:           childRow?.name || '',
                unitType:       childRow?.unitType || '',
              })
            );
        
            return {
              ...row,
              checkItems: updatedCheckItemsList,

            };
          }
          return row;
        });
        
        
        setCheckItemLists(params_);
      }
      // setCheckItemLists(machineServiceRecord?.serviceRecordConfig?.checkItemLists);
    }
  }, [machineServiceRecord]);

  const machineDecoilers = (machine?.machineConnections || []).map((decoiler) => ({
    _id: decoiler?.connectedMachine?._id ?? null,
    name: decoiler?.connectedMachine?.name ?? null,
    serialNo: decoiler?.connectedMachine?.serialNo ?? null
  }));

  const defaultDecoilers = (machineServiceRecord?.decoilers || []).map((decoiler) => ({
    _id: decoiler?._id ?? null,
    name: decoiler?.name ?? "",
    serialNo: decoiler?.serialNo ?? ""
  }));

  const machineOperators = (activeContacts || []).map((con) => ({
    _id: con?._id ?? null,
    firstName: con?.firstName ?? "",
    lastName: con?.lastName ?? ""
  }));

  const defaultValues = useMemo(
    () => ({
      recordType:                 machineServiceRecord?.serviceRecordConfig?.recordType || null,
      serviceRecordConfiguration: machineServiceRecord?.serviceRecordConfig || null,
      serviceDate:                machineServiceRecord?.serviceDate || new Date(),
      versionNo:                  Number(machineServiceRecord?.versionNo) + 1 || 1,
      // customer:                   machineServiceRecord?.customer || null,
      site:                       machineServiceRecord?.site || null,
      machine:                    machineServiceRecord?.machine || null,
      decoilers:                  defaultDecoilers || [],
      technician:                 machineServiceRecord?.technician || null,
      technicianNotes:            machineServiceRecord?.technicianNotes || '',
      textBeforeCheckItems:       machineServiceRecord?.textBeforeCheckItems || '',
      textAfterCheckItems:        machineServiceRecord?.textAfterCheckItems || '',
      serviceNote:                machineServiceRecord?.serviceNote || '',
      recommendationNote:         machineServiceRecord?.recommendationNote || '',
      internalComments:           machineServiceRecord?.internalComments || '',
      suggestedSpares:            machineServiceRecord?.suggestedSpares || '',
      internalNote:               machineServiceRecord?.internalNote || '',
      operators:                  machineServiceRecord?.operators || [],
      operatorNotes:              machineServiceRecord?.operatorNotes || '',
      // files: machineServiceRecord?.files || [],
      isActive:                   machineServiceRecord?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineServiceRecord, machine]
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { serviceDate, files, serviceRecordConfiguration, decoilers, operators } = watch()

  const handleServiceDateChange = (newValue) => setValue("serviceDate", newValue)

  useEffect(() => {
    if (machineServiceRecord) {
      reset(defaultValues);
    }
  }, [machineServiceRecord, reset, defaultValues]);

  const toggleCancel = () => { dispatch(setMachineServiceRecordViewFormVisibility(true)) };
  
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
                // name:CI.name,
                checkItemListId:  checkParam_?._id,
                checkItemValue:  CI?.checkItemValue,
                // date:CI?.date || '',
                comments:CI?.comments,
                // status:CI?.status?.name
              })
            ));
          }
        });
      data.checkItemRecordValues = checkItemLists_;
      data.decoilers = decoilers;
      data.serviceId = machineServiceRecord?.serviceId || null
      data.operators = operators;
      await dispatch(updateMachineServiceRecord(machine?._id ,machineServiceRecord?._id , data));
      // await dispatch(getMachineServiceRecord(machine?._id, machineServiceRecord?._id))
      reset();
      dispatch(setMachineServiceRecordViewFormVisibility(true));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
    }
  };

  useCallback(
    (index,acceptedFiles) => {
      const docFiles =  [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setCheckParam((prevVal) => {
        const updatedVal = [...prevVal];
        updatedVal[index] = {
          files: [...(checkParam[index]?.files ?? []), ...newFiles],
          serviceParam: updatedVal[index]?.serviceParam || null,
          name: updatedVal[index]?.name || '',
          checkItemsTitle: updatedVal[index]?.checkItemsTitle || '',
          value: updatedVal[index]?.value || '',
          date: updatedVal[index]?.value || '',
          status: updatedVal[index]?.status,
          comments: updatedVal[index]?.comments || '',
        };
        return updatedVal;
      });

      setValue(`checkParamFiles${index}`, [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [setValue, checkParam]
  );


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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={3}>
      <Grid item xs={18} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <FormHeading heading="Edit Service Record" />
              {/* <Grid container>
                <ViewFormField sm={6} heading='Machine'                 param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} label="serialNo"/>
                <ViewFormField sm={6} heading='Machine Model Category'  param={machine?.machineModel?.category?.name} label="serialNo"/>
                <ViewFormField sm={6} heading='Machine Model'           param={machine?.machineModel?.name} label="serialNo"/>
                <ViewFormField sm={6} heading='Decoilers'          arrayParam={defaultValues.decoilers} chipLabel="serialNo"/>
              </Grid> */}
            {/* <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="customer" label="Customer" value={`${machine?.customer?.name ? machine?.customer?.name : ''}`} disabled/>
                <RHFTextField name="machine" label="Machine" value={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} disabled/>
                <RHFTextField name="machine" label="Machine Model Category" value={machine?.machineModel?.category?.name || ''} disabled/>
                <RHFTextField name="machine" label="Machine Model" value={machine?.machineModel?.name || ''} disabled/>
            </Box> */}

            <RHFTextField
                    disabled
                    name="serviceRecordConfiguration"
                    label="Service Record Configuration"
                    value={`${serviceRecordConfiguration?.docTitle ?? ''} ${serviceRecordConfiguration?.docTitle ? '-' : '' } ${serviceRecordConfiguration?.recordType ??  ''}`}
                  />

            <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >

              <RHFDatePicker name="serviceDate" label="Service Date" />
              <RHFTextField name="versionNo" label="Version No" disabled/>

              {/* <Autocomplete multiple
                  readonly
                  name="decoilers"
                  defaultValue={defaultValues.decoilers}
                  id="decoilers-autocomplete" options={machineDecoilers}
                  onChange={(event, newValue) => setValue('decoilers',newValue)}
                  getOptionLabel={(option) => `${option?.name||""} ${option?.serialNo||""}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Decoilers" placeholder="Select Decoilers"/>
                  )}
                /> */}
              </Box>
              <RHFAutocomplete
                name="technician"
                label="Technician"
                options={activeSecurityUsers}
                getOptionLabel={(option) => `${option?.name || ''}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>{`${option?.name || ''}`}</li>
                )}
              />
              <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/>
              <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline/> 

                {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 && <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

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
                    {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.map((row, index) =>
                          ( typeof row?.checkItems?.length === 'number' &&
                          <>
                            <CollapsibleCheckedItemInputRow 
                              row={row} 
                              key={index}
                              index={index} 
                              editPage
                              checkItemLists={checkItemLists} 
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                            />
                        </>
                          ))}
                      </>
                    }

                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline/> 
                
                <RHFTextField name="internalComments" label="Internal Comments" minRows={3} multiline/>
                { serviceRecordConfiguration?.enableNote && <RHFTextField name="serviceNote" label="Note" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }

                <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 

                {/* {defaultValues?.recordType==='Training' && */}
                  <Autocomplete multiple
                    name="operators"
                    defaultValue={defaultValues.operators}
                    id="operator-autocomplete" options={machineOperators}
                    onChange={(event, newValue) => setValue('operators',newValue)}
                    getOptionLabel={(option) => `${option.firstName ? option.firstName :   ''} ${option.lastName ? option.lastName :   ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Operators" placeholder="Select Operators"/>
                    )}
                  />
                {/* } */}

                <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 

              {/* <Grid item xs={12} md={6} lg={12}>
                <RHFUpload
                  multiple
                  thumbnail
                  name="files"
                  // maxSize={3145728}
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
              </Grid> */}

            <Grid container display="flex">

              <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                    Active
                  </Typography>
                }
              />
            </Grid>

            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  </FormProvider>
  );
}

export default memo(MachineServiceRecordEditForm)
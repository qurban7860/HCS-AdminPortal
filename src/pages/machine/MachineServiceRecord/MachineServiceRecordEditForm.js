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
  const [checkParamList, setCheckParamList] = useState([]);
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
      const checkParams = machineServiceRecord?.serviceRecordConfig?.checkParams;
      if (checkParams) {

        const params_ = checkParams.map((row, index) => {
          if (row && row.paramList) {
            const updatedParamList = row.paramList.map((childRow, childIndex) => {
              const foundParam = machineServiceRecord.checkParams.find(
                (param) =>
                  param?.serviceParam === childRow?._id &&
                  param?.paramListTitle === row?.paramListTitle
              );
              return {
                ...childRow,
                value: foundParam ? foundParam.value : '',
                status: foundParam ? { name: foundParam.status } : null,
                comments: foundParam ? foundParam.comments : '',
              };
            });
        
            return {
              ...row,
              paramList: updatedParamList,
            };
          }
          return row;
        });
        
        
        setCheckParamList(params_);
      }
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
      serviceDate:                machineServiceRecord?.serviceDate || null,
      customer:                   machineServiceRecord?.customer || null,
      site:                       machineServiceRecord?.site || null,
      machine:                    machineServiceRecord?.machine || null,
      decoilers:                  defaultDecoilers || [],
      technician:                 machineServiceRecord?.technician || null,
      // checkParams:
      serviceNote:                machineServiceRecord?.serviceNote || '',
      maintenanceRecommendation:  machineServiceRecord?.maintenanceRecommendation || '',
      suggestedSpares:            machineServiceRecord?.suggestedSpares || '',
      // files: machineServiceRecord?.files || [],
      operators:                  machineServiceRecord?.operators || [],
      technicianRemarks:          machineServiceRecord?.technicianRemarks || '',
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
      const checkParams_ = [];
      if(Array.isArray(checkParamList) &&
        checkParamList.length > 0)
        checkParamList.forEach((checkParam_, index )=>{
          if(Array.isArray(checkParam_.paramList) &&
            checkParam_.paramList.length>0) {
            checkParam_.paramList.forEach((CI,ind)=>{
              checkParams_.push({
                serviceParam:CI._id,
                name:CI.name || "",
                paramListTitle:checkParam_.paramListTitle || "",
                value:CI.value || "",
                comments: CI?.comments || "" ,
                status: CI?.status?.name || "" ,
              });
            });
          }
        });
        console.log("checkParams_ : ",checkParams_)
      data.checkParams = checkParams_;
      data.decoilers = decoilers;
      data.operators = operators;
      await dispatch(updateMachineServiceRecord(machine?._id ,machineServiceRecord?._id , data));
      await dispatch(getMachineServiceRecord(machine?._id, machineServiceRecord?._id))
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
          paramListTitle: updatedVal[index]?.paramListTitle || '',
          value: updatedVal[index]?.value || '',
          status: updatedVal[index]?.status,
          comments: updatedVal[index]?.comments || '',
        };
        return updatedVal;
      });

      setValue(`checkParamFiles${index}`, [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [setValue, checkParam]
  );



  const handleChangeCheckItemListValue = (index, childIndex, value) => {
    const updatedCheckParams = [...checkParamList];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      paramList: [...updatedCheckParams[index].paramList],
    };
    updatedParamObject.paramList[childIndex] = {
      ...updatedParamObject.paramList[childIndex],
      value,
    };
    updatedCheckParams[index] = updatedParamObject;
setCheckParamList(updatedCheckParams);
}

const handleChangeCheckItemListCheckBoxValue = (index, childIndex) => {
    const updatedCheckParams = [...checkParamList];
      const updatedParamObject = { 
        ...updatedCheckParams[index],
        paramList: [ ...updatedCheckParams[index].paramList],
      };
      updatedParamObject.paramList[childIndex] = {
        ...updatedParamObject.paramList[childIndex],
        value: !updatedParamObject.paramList[childIndex].value,
      };
      updatedCheckParams[index] = updatedParamObject;
    setCheckParamList(updatedCheckParams);
}

const handleChangeCheckItemListStatus = (index, childIndex, status) => {
  const updatedCheckParams = [...checkParamList];
  const updatedParamObject = { 
    ...updatedCheckParams[index],
    paramList: [ ...updatedCheckParams[index].paramList ],
  };
  updatedParamObject.paramList[childIndex] = {
    ...updatedParamObject.paramList[childIndex],
    status
  };
  updatedCheckParams[index] = updatedParamObject;
setCheckParamList(updatedCheckParams);
}

const handleChangeCheckItemListComment = (index, childIndex, comments) => {
  const updatedCheckParams = [...checkParamList];
  const updatedParamObject = { 
    ...updatedCheckParams[index],
    paramList: [...updatedCheckParams[index].paramList ],
  };
  updatedParamObject.paramList[childIndex] = {
    ...updatedParamObject.paramList[childIndex],
    comments
  };
  updatedCheckParams[index] = updatedParamObject;
setCheckParamList(updatedCheckParams);
}

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={3}>
      <Grid item xs={18} md={12}>
        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <FormHeading heading="Edit Service Record" />
              <Grid container>
                <ViewFormField sm={6} heading='Customer'                param={machine?.customer?.name} label="serialNo"/>
                <ViewFormField sm={6} heading='Machine'                 param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} label="serialNo"/>
                <ViewFormField sm={6} heading='Machine Model Category'  param={machine?.machineModel?.category?.name} label="serialNo"/>
                <ViewFormField sm={6} heading='Machine Model'           param={machine?.machineModel?.name} label="serialNo"/>
                <ViewFormField sm={6} heading='Decoilers'          arrayParam={defaultValues.decoilers} chipLabel="serialNo"/>
              </Grid>
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
              <RHFTextField name="technicianRemarks" label="Technician Remarks" minRows={3} multiline/>
                {checkParamList?.length > 0 && <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

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
                    {checkParamList?.map((row, index) =>
                          ( typeof row?.paramList?.length === 'number' &&
                          <>
                            <CollapsibleCheckedItemInputRow 
                              row={row} 
                              key={index}
                              index={index} 
                              checkParamList={checkParamList} 
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                            />
                        </>
                          ))}
                      </>
                    }

                { serviceRecordConfiguration?.enableNote && <RHFTextField name="serviceNote" label="Note" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableMaintenanceRecommendations && <RHFTextField name="maintenanceRecommendation" label="Maintenance Recommendation" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }

                {defaultValues?.recordType==='Training' &&
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
                }


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
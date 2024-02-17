import {  useEffect, useCallback, useMemo, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Skeleton } from '@mui/material';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// slice
import { updateMachineServiceRecord, setMachineServiceRecordViewFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../../constants/default-constants';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFDatePicker } from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

function MachineServiceRecordEditForm() {

  const { userId } = useAuthContext()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { activeContacts } = useSelector((state) => state.contact);
  const { isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);
  const { machine } = useSelector((state) => state.machine);
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);

  const [checkParam, setCheckParam] = useState([]);
  const [checkItemLists, setCheckItemLists] = useState([]);
  const [ securityUsers, setSecurityUsers ] = useState([]);
  
  
  useEffect( ()=>{
    dispatch(resetActiveContacts())
    if( userId ) dispatch(getSecurityUser( userId ))
    if(machine?.customer?._id){
      dispatch(getActiveContacts(machine?.customer?._id))
    }
    dispatch(getActiveSecurityUsers({roleType:['TechnicalManager','Technician']}))
  },[dispatch, machine, userId ])

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
    }
  }, [machineServiceRecord]);


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
      recordType:                       machineServiceRecord?.serviceRecordConfig?.recordType || null,
      serviceRecordConfiguration:       machineServiceRecord?.serviceRecordConfig || null,
      serviceRecordConfigurationName:   `${machineServiceRecord?.serviceRecordConfig?.docTitle ?? ''} ${machineServiceRecord?.serviceRecordConfig?.docTitle ? '-' : '' } ${machineServiceRecord?.serviceRecordConfig?.recordType ??  ''}` || '',
      serviceDate:                      machineServiceRecord?.serviceDate || new Date(),
      versionNo:                        Number(machineServiceRecord?.versionNo) + 1 || 1,
      site:                             machineServiceRecord?.site || null,
      machine:                          machineServiceRecord?.machine || null,
      decoilers:                        defaultDecoilers || [],
      technician:                       machineServiceRecord?.technician || null,
      technicianNotes:                  machineServiceRecord?.technicianNotes || '',
      textBeforeCheckItems:             machineServiceRecord?.textBeforeCheckItems || '',
      textAfterCheckItems:              machineServiceRecord?.textAfterCheckItems || '',
      serviceNote:                      machineServiceRecord?.serviceNote || '',
      recommendationNote:               machineServiceRecord?.recommendationNote || '',
      internalComments:                 machineServiceRecord?.internalComments || '',
      suggestedSpares:                  machineServiceRecord?.suggestedSpares || '',
      internalNote:                     machineServiceRecord?.internalNote || '',
      operators:                        machineServiceRecord?.operators || [],
      operatorNotes:                    machineServiceRecord?.operatorNotes || '',
      isActive:                         machineServiceRecord?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ ]
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { serviceRecordConfiguration, decoilers, operators, technician } = watch()

  useEffect(() => {
    if (machineServiceRecord) {
      reset(defaultValues);
    }
  }, [machineServiceRecord, reset, defaultValues]);

  useEffect(()=>{ 
    if( !activeSecurityUsers.some(u => u._id === userId ) && userId !== technician ){
      setSecurityUsers([ ...activeSecurityUsers, securityUser, technician ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    } else if(!activeSecurityUsers.some(u => u._id === userId ) ){
      setSecurityUsers([ ...activeSecurityUsers, securityUser ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }else {
      setSecurityUsers([ ...activeSecurityUsers ]?.sort((a, b) => a?.name?.localeCompare(b?.name))) 
    }  
  }, [ activeSecurityUsers, securityUser, technician, userId ])


  const toggleCancel = () => dispatch(setMachineServiceRecordViewFormVisibility(true));
  
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
                checkItemValue:  CI?.inputType?.toLowerCase() === 'boolean' ? CI?.checkItemValue || false : CI?.inputType?.toLowerCase() === 'status' && CI?.checkItemValue?.name || CI?.inputType?.toLowerCase() !== 'status' &&CI?.checkItemValue || '',
                comments:CI?.comments,
              })
              ));
            }
          });
      data.checkItemRecordValues = checkItemLists_;
      data.decoilers = decoilers;
      data.serviceId = machineServiceRecord?.serviceId || null
      data.operators = operators;
      await dispatch(updateMachineServiceRecord(machine?._id ,machineServiceRecord?._id , data));
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
          <FormLabel content="Edit Service Record" />
            <RHFTextField disabled name="serviceRecordConfigurationName" label="Service Record Configuration" />
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
                options={securityUsers}
                getOptionLabel={(option) => `${option?.name || ''}`}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.name || ''}`}</li> )}
              />

              <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/>
              <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline/> 
                {machineServiceRecord?.serviceRecordConfig?.checkItemLists?.length > 0 &&   <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}
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
                          ))}
                      </>
                    }
                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline/> 
                { serviceRecordConfiguration?.enableNote && <RHFTextField name="serviceNote" label="Service Note" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
                { serviceRecordConfiguration?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 
                <RHFAutocomplete 
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="operators"
                  label="Operators"
                  options={machineOperators}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                />
                <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 
            <Grid container display="flex">
              <RHFSwitch name="isActive" label="Active" />
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
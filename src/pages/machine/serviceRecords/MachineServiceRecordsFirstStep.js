import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
// import FormProvider from '../../../components/hook-form';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFTextField, RHFAutocomplete, RHFDatePicker } from '../../../components/hook-form';
import { MachineServiceRecordPart1Schema } from '../../schemas/machine';
import { PATH_MACHINE } from '../../../routes/paths';
import { addMachineServiceRecord, deleteMachineServiceRecord, setFormActiveStep, updateMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';

MachineServiceRecordsFirstStep.propTypes = {
    securityUsers: PropTypes.array,
    onChangeConfig : PropTypes.func,
    handleComplete : PropTypes.func,
    handleDraftRequest: PropTypes.func,
    handleDiscard: PropTypes.func,
    handleBack: PropTypes.func
};

function MachineServiceRecordsFirstStep( { securityUsers, onChangeConfig, handleComplete, handleDraftRequest, handleDiscard, handleBack} ) {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
  
    const { recordTypes, activeServiceRecordConfigsForRecords } = useSelector((state) => state.serviceRecordConfig);
    const { machineServiceRecord, isLoading } = useSelector((state) => state.machineServiceRecord);
    const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
    const { machine } = useSelector((state) => state.machine);
    const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);

    const [ isDraft, setIsDraft ] = useState(false);
    const saveAsDraft = async () => setIsDraft(true);

    const defaultValues = useMemo(
        () => {
          const initialValues = {
          docRecordType:                recordTypes.find(rt=> rt?.name?.toLowerCase() === machineServiceRecord?.serviceRecordConfig?.recordType?.toLowerCase()) || null,
          serviceRecordConfiguration:   machineServiceRecord?.serviceRecordConfiguration || null,
          serviceDate:                  machineServiceRecord?.serviceDate || new Date(),
          versionNo:                    machineServiceRecord?.versionNo || 1,
          technician:                   machineServiceRecord?.technician || ( securityUser || null ),
          technicianNotes:              machineServiceRecord?.technicianNotes || '',
          textBeforeCheckItems:         machineServiceRecord?.textBeforeCheckItems || '',
          textAfterCheckItems:          machineServiceRecord?.textAfterCheckItems || '',
        }
        return initialValues;
      },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ machineServiceRecord ]
      );

    const methods = useForm({
        resolver: yupResolver(MachineServiceRecordPart1Schema),
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

    useEffect(() => {
      if (machineServiceRecord) {
        reset(defaultValues);
      }
    }, [reset, machineServiceRecord, defaultValues]);

    const { serviceRecordConfiguration, docRecordType } = watch();

    useLayoutEffect(()=>{
        if(machineServiceRecord?._id){
            setValue('recordType', recordTypes.find(rt=> rt?.name?.toLowerCase() === machineServiceRecord?.serviceRecordConfig?.recordType?.toLowerCase()))
            setValue('serviceRecordConfiguration', activeServiceRecordConfigs.find(asrc=> asrc?._id === machineServiceRecord?.serviceRecordConfig?._id))
        }
    },[machineServiceRecord,activeServiceRecordConfigs, recordTypes, setValue])

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
      const onSubmit = async (data) => {
        console.log('called')
        try {
          if(!machineServiceRecord?._id ){
            const serviceRecord = await dispatch(addMachineServiceRecord(machine?._id, data));
            await navigate(PATH_MACHINE.machines.serviceRecords.edit(machine?._id, serviceRecord?._id))
          }else {
            const serviceRecord = await dispatch(updateMachineServiceRecord(machine?._id, machineServiceRecord?._id, data));
            await navigate(PATH_MACHINE.machines.serviceRecords.edit(machine?._id, machineServiceRecord?._id))  
          }

          if(isDraft){
            await handleDraftRequest(isDraft);
          }else{
            await dispatch(setFormActiveStep(1));
            await handleComplete(0);
          }
    
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Saving failed!', { variant: `error` });
        }
      };


return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack px={2} spacing={2}>
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    sx={{width:'100%'}}
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
                        onChange={(option, newValue)=>{
                            setValue('serviceRecordConfiguration',newValue);
                            setValue('textBeforeCheckItems',newValue?.textBeforeCheckItems);
                            setValue('textAfterCheckItems',newValue?.textAfterCheckItems);
                            // onChangeConfig(newValue)
                        }}
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
        </Stack>
        <ServiceRecodStepButtons handleDraft={saveAsDraft} isDraft={isDraft} isSubmitting={isSubmitting || isLoading} />
    </FormProvider>
)
}

export default MachineServiceRecordsFirstStep
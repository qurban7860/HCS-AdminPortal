import React, { useEffect, useLayoutEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFTextField, RHFAutocomplete, RHFDatePicker, RHFUpload } from '../../../components/hook-form';
import { MachineServiceRecordPart1Schema } from '../../schemas/machine';
import { useAuthContext } from '../../../auth/useAuthContext';
import { PATH_MACHINE } from '../../../routes/paths';
import { getActiveSPContacts, resetActiveSPContacts } from '../../../redux/slices/customer/contact';
import { addMachineServiceRecord, setFormActiveStep, updateMachineServiceRecord, addMachineServiceRecordFiles, deleteRecordFile, downloadRecordFile  } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';

MachineServiceRecordsFirstStep.propTypes = {
    handleComplete : PropTypes.func,
    handleDraftRequest: PropTypes.func,
    handleDiscard: PropTypes.func,
};

function MachineServiceRecordsFirstStep( { handleComplete, handleDraftRequest, handleDiscard } ) {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { machineId, id } = useParams();
    const { user  } = useAuthContext()
    const { recordTypes, activeServiceRecordConfigsForRecords } = useSelector((state) => state.serviceRecordConfig);
    const { activeSpContacts } = useSelector((state) => state.contact);
    const { machineServiceRecord, isLoading } = useSelector((state) => state.machineServiceRecord);
    const { machine } = useSelector((state) => state.machine);
    const [ technicians, setTechnicians ] = useState([]);
    const [ isDraft, setIsDraft ] = useState(false);
    const [ isSubmit, setIsSubmit ] = useState(false);
    const saveAsDraft = async () => setIsDraft(true);
    const saveAsSubmit = async () => setIsSubmit(true);
    const machineDecoilers = (machine?.machineConnections || [])?.map((decoiler) => ({
      _id: decoiler?.connectedMachine?._id ?? null,
      name: decoiler?.connectedMachine?.name ?? null,
      serialNo: decoiler?.connectedMachine?.serialNo ?? null
    }));

    useLayoutEffect(() => {
      dispatch(getActiveServiceRecordConfigsForRecords(machineId));
      dispatch(getActiveSPContacts());
      return () =>{
          dispatch(resetActiveSPContacts());
          dispatch(resetServiceRecordConfig())
      }
    }, [ dispatch, machineId ]);

    const defaultValues = useMemo(
      () => {
        const initialValues = {
        docRecordType:                recordTypes.find(rt=> rt?.name?.toLowerCase() === machineServiceRecord?.serviceRecordConfig?.recordType?.toLowerCase()) || null,
        serviceRecordConfiguration:   machineServiceRecord?.serviceRecordConfig || null,
        serviceDate:                  machineServiceRecord?.serviceDate || new Date(),
        versionNo:                    machineServiceRecord?.versionNo || 1,
        technician:                   machineServiceRecord?.technician || null ,
        technicianNotes:              machineServiceRecord?.technicianNotes || '',
        textBeforeCheckItems:         machineServiceRecord?.textBeforeCheckItems || '',
        textAfterCheckItems:          machineServiceRecord?.textAfterCheckItems || '',
        files: machineServiceRecord?.files?.map(file => ({
          key: file?._id,
          _id: file?._id,
          name:`${file?.name}.${file?.extension}`,
          type: file?.fileType,
          fileType: file?.fileType,
          preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
          src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
          path:`${file?.name}.${file?.extension}`,
          downloadFilename:`${file?.name}.${file?.extension}`,
          machineId:machineServiceRecord?.machineId,
          serviceId: id,
        })) || [],
      }
      return initialValues;
    }, [ machineServiceRecord, recordTypes, id ] );

    const methods = useForm({
        resolver: yupResolver(MachineServiceRecordPart1Schema),
        defaultValues,
        mode: 'onBlur',
        reValidateMode: 'onSubmit',
    });
    
    const {
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
    } = methods;

  useEffect(() => {
    const sPContactUser = activeSpContacts?.find( ( el )=> el?._id === user?.contact );
    let techniciansList = activeSpContacts?.filter( ( el ) => el?.departmentDetails?.departmentType?.toLowerCase() === 'technical');
    if ( sPContactUser && !techniciansList?.some( ( el ) => el?._id === user?.contact ) ) {
      techniciansList = [ sPContactUser, ...techniciansList ]
    }
    if( !machineServiceRecord?._id ){
      setValue('technician', sPContactUser || null );
    }
    if ( machineServiceRecord?.technician?._id && techniciansList?.some( ( el ) => ( el?._id !== machineServiceRecord?.technician?._id ) ) ) {
      techniciansList = [ machineServiceRecord?.technician, ...techniciansList ];
      setValue('technician', machineServiceRecord?.technician || null );
    }
    techniciansList = techniciansList?.sort((a, b) => a?.firstName.localeCompare(b?.firstName) );
    setTechnicians(techniciansList);
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ activeSpContacts, setValue, user?.contact, id ]);

    useEffect(() => {
      if (machineServiceRecord) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, machineServiceRecord ]);

    const { docRecordType, serviceRecordConfiguration, files } = watch();
      const onSubmit = async (data) => {
        try {
          if(isSubmit){
            data.status = 'SUBMITTED'
          }
          data.isReportDoc = true
          if(!id ){
            data.isReportDocsOnly = true;
            data.decoilers = machineDecoilers;
            const serviceRecord = await dispatch(addMachineServiceRecord(machineId, data));
            dispatchFiles( serviceRecord?._id, data );
            if( isSubmit ){
              await navigate(PATH_MACHINE.machines.serviceRecords.view(machineId, serviceRecord?._id))
            } else {
              await navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, serviceRecord?._id))
            }
          }else {
            await dispatch(updateMachineServiceRecord(machineId, id, data));
            dispatchFiles( id, data );
            if( isSubmit ){
              await navigate(PATH_MACHINE.machines.serviceRecords.view(machineId, id))
            } else {
              await navigate(PATH_MACHINE.machines.serviceRecords.edit(machineId, id))  
            }
          }

          if(isDraft){
            await handleDraftRequest(isDraft);
          }else if(!isSubmit){
            await dispatch(setFormActiveStep(1));
            await handleComplete(0);
          }
    
        } catch (err) {
          console.error(err);
          enqueueSnackbar('Saving failed!', { variant: `error` });
        }
      };
    const dispatchFiles = async ( serviceID,data )  => {
      if(Array.isArray(data?.files) && data?.files?.length > 0){
        const filteredFiles = data?.files?.filter((ff)=> !ff?._id)
        if(Array.isArray(filteredFiles) && filteredFiles?.length > 0){
            await dispatch(addMachineServiceRecordFiles(machineId, serviceID, { files: filteredFiles, isReportDoc: data?.isReportDoc } ))
        }
      }
    }

      const handleRemoveFile = async (inputFile) => {
        if (inputFile?._id) {
          await dispatch(deleteRecordFile(machineId, id, inputFile?._id));
        }
      
        if (files.length > 1) {
          setValue(
            'files',
            files.filter((file) => file !== inputFile),
            { shouldValidate: true }
          );
        } else {
          setValue('files', [], { shouldValidate: true });
        }
      };

      const regEx = /^[^2]*/;
      const handleLoadImage = async (imageId, imageIndex) => {
        try {
          const response = await dispatch(downloadRecordFile(machineId, id, imageId));
      
          if (regEx.test(response.status)) {
            // Update the image property in the imagesLightbox array
            const existingFiles = getValues('files') || [];
            const image = existingFiles[imageIndex];
      
            if (image) {
              existingFiles[imageIndex] = {
                ...image,
                src: `data:${image?.fileType};base64,${response.data}`,
                preview: `data:${image?.fileType};base64,${response.data}`,
                isLoaded: true,
              };
      
              setValue('files', existingFiles, { shouldValidate: true });
            }
          }
        } catch (error) {
          console.error('Error loading full file:', error);
        }
      };

      const handleDropMultiFile = useCallback(
        async (acceptedFiles) => {
          const docFiles = files || [];
          const newFiles = acceptedFiles.map((file, index) => 
              Object.assign(file, {
                preview: URL.createObjectURL(file),
                src: URL.createObjectURL(file),
                isLoaded:true
              })
          );
          setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ files ]
      );

return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isLoading?
          <Stack px={2} spacing={2}>
            {
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLine key={index} />
              ))
            }
          </Stack>
        :
        <>
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
                      disabled={id && true }
                      options={recordTypes}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                          <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, newValue) =>{
                          if(newValue){
                            setValue('docRecordType',newValue)
                            if( serviceRecordConfiguration?.recordType?.toUpperCase() !== newValue?.name?.toUpperCase() ){
                              setValue('serviceRecordConfiguration',null)
                            }
                          } else {
                            setValue('serviceRecordConfiguration',null )
                            setValue('docRecordType', null )
                          }
                          trigger('serviceRecordConfiguration')
                          trigger('docRecordType')
                        }
                      }
                  />

                  <RHFAutocomplete
                    name="serviceRecordConfiguration"
                    label="Service Record Configuration*"
                    disabled={id && true }
                    options={activeServiceRecordConfigsForRecords.filter( src => !docRecordType || src?.recordType?.toLowerCase() === docRecordType?.name?.toLowerCase() )}
                    getOptionLabel={(option) => `${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}</li>
                    )}
                    onChange={(event, newValue) =>{
                        if(newValue){
                          setValue('serviceRecordConfiguration',newValue)
                          if(!docRecordType || newValue?.recordType?.toUpperCase() !== docRecordType?.name?.toUpperCase() ){
                            setValue('docRecordType',recordTypes?.find((rt)=> rt?.name?.toUpperCase() === newValue?.recordType?.toUpperCase()))
                          }
                          setValue('textBeforeCheckItems',newValue?.textBeforeCheckItems || '')
                          setValue('textAfterCheckItems',newValue?.textAfterCheckItems || '')
                        } else {
                          setValue('serviceRecordConfiguration',null )
                          setValue('textBeforeCheckItems', '')
                          setValue('textAfterCheckItems', '')
                        }
                        trigger('docRecordType')
                        trigger('serviceRecordConfiguration')
                      }
                    }
                  />

                  </Box> 

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="serviceDate" label="Service Date" />
                    <RHFTextField name="versionNo" label="Version No" disabled />
                  </Box>

                  <RHFAutocomplete
                    name="technician"
                    label="Technician"
                    options={ technicians }
                    getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
                  />

                  <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/> 

                  <RHFUpload multiple  thumbnail name="files" imagesOnly
                    onDrop={handleDropMultiFile}
                    dropZone={false}
                    onRemove={handleRemoveFile}
                    onLoadImage={handleLoadImage}
                  />
          </Stack>
          <ServiceRecodStepButtons handleSubmit={saveAsSubmit} isSubmitted={isSubmit} handleDraft={saveAsDraft} isDraft={isDraft} isSubmitting={isSubmitting} />
          </>
        }
    </FormProvider>
)
}

export default MachineServiceRecordsFirstStep